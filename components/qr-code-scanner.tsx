
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera,
  X,
  Flashlight,
  RotateCcw,
  QrCode,
  CheckCircle,
  AlertCircle,
  Upload,
  ScanLine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { toast } from 'sonner';

interface QRCodeScannerProps {
  onClose: () => void;
  onQRDetected: (data: string) => void;
  isOpen: boolean;
}

interface QRScanResult {
  data: string;
  timestamp: number;
  location?: string;
}

export default function QRCodeScanner({ onClose, onQRDetected, isOpen }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<QRScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadCameraDevices();
      initializeCamera();
    } else {
      cleanupCamera();
    }
    
    return () => {
      cleanupCamera();
    };
  }, [isOpen]);

  const loadCameraDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      if (videoDevices.length > 0 && !currentDeviceId) {
        // Prefer back camera on mobile
        const backCamera = videoDevices.find(d => d.label.toLowerCase().includes('back'));
        setCurrentDeviceId(backCamera?.deviceId || videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Failed to enumerate devices:', err);
    }
  };

  const initializeCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      if (currentDeviceId) {
        constraints.video = {
          deviceId: { exact: currentDeviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasPermission(true);
        setIsScanning(true);
        startScanning();
        toast.success('Camera activated');
      }
    } catch (err) {
      console.error('Camera initialization failed:', err);
      setError('Failed to access camera. Please check permissions.');
      setHasPermission(false);
      toast.error('Camera access denied');
    }
  };

  const cleanupCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(() => {
      scanQRCode();
    }, 500); // Scan every 500ms
  };

  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use the browser's built-in QR code detection if available
      if ('BarcodeDetector' in window) {
        // @ts-ignore
        const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await barcodeDetector.detect(imageData);
        
        if (barcodes.length > 0) {
          const qrData = barcodes[0].rawValue;
          handleQRDetected(qrData);
        }
      } else {
        // Fallback: Use jsQR library or similar
        // For now, show a message that QR detection is not available
        console.warn('BarcodeDetector API not available');
      }
    } catch (err) {
      console.error('QR scanning error:', err);
    }
  };

  const handleQRDetected = (data: string) => {
    const result: QRScanResult = {
      data,
      timestamp: Date.now(),
      location: getLocationFromQR(data)
    };

    setScanResult(result);
    setScanHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 scans
    setIsScanning(false);
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    toast.success('QR Code detected!');
    
    setTimeout(() => {
      onQRDetected(data);
      handleClose();
    }, 1500);
  };

  const getLocationFromQR = (data: string): string => {
    // Parse QR data to extract location info
    const lowerData = data.toLowerCase();
    
    if (lowerData.includes('bedroom')) return 'Bedroom';
    if (lowerData.includes('lounge') || lowerData.includes('living')) return 'Lounge';
    if (lowerData.includes('kitchen')) return 'Kitchen';
    if (lowerData.includes('bathroom') || lowerData.includes('toilet')) return 'Bathroom';
    if (lowerData.includes('garden')) return 'Garden';
    if (lowerData.includes('games')) return 'Games Room';
    if (lowerData.includes('utility')) return 'Utility Room';
    if (lowerData.includes('ensuite')) return 'Ensuite Bedroom';
    
    return 'Unknown Location';
  };

  const handleClose = () => {
    cleanupCamera();
    onClose();
  };

  const toggleFlash = async () => {
    try {
      if (streamRef.current) {
        const track = streamRef.current.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        
        // @ts-ignore
        if (capabilities.torch) {
          await track.applyConstraints({
            // @ts-ignore
            advanced: [{ torch: !isFlashOn }]
          });
          setIsFlashOn(!isFlashOn);
          toast.success(isFlashOn ? 'Flash off' : 'Flash on');
        } else {
          toast.error('Flash not supported on this device');
        }
      }
    } catch (err) {
      console.error('Flash toggle failed:', err);
      toast.error('Failed to toggle flash');
    }
  };

  const switchCamera = async () => {
    if (devices.length <= 1) {
      toast.error('No other cameras available');
      return;
    }

    const currentIndex = devices.findIndex(d => d.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];

    cleanupCamera();
    setCurrentDeviceId(nextDevice.deviceId);
    
    setTimeout(() => {
      initializeCamera();
    }, 100);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = async (e) => {
        img.src = e.target?.result as string;
        img.onload = async () => {
          if (!canvasRef.current) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if ('BarcodeDetector' in window) {
            // @ts-ignore
            const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await barcodeDetector.detect(imageData);
            
            if (barcodes.length > 0) {
              const qrData = barcodes[0].rawValue;
              handleQRDetected(qrData);
            } else {
              toast.error('No QR code found in image');
            }
          } else {
            toast.error('QR code detection not supported');
          }
        };
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error:', err);
      toast.error('Failed to process image');
    }
  };

  const ScanningOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Scanning frame */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 border border-white/50 rounded-3xl relative overflow-hidden shadow-lg">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-6 border-l-6 border-indigo-400 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-6 border-r-6 border-indigo-400 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-6 border-l-6 border-indigo-400 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-6 border-r-6 border-indigo-400 rounded-br-xl"></div>
          
          {/* Scanning line animation */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 380 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-lg"
          >
            <ScanLine className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400" />
          </motion.div>
        </div>
        
        {/* Instructions */}
        <motion.div 
          className="mt-8 text-center"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <QrCode className="w-12 h-12 mx-auto mb-3 text-white drop-shadow-lg" />
          <p className="text-white text-xl font-bold drop-shadow-lg mb-2">
            Point camera at QR code
          </p>
          <p className="text-white/90 text-base drop-shadow">
            Hold steady for best results
          </p>
        </motion.div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header Controls */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={combineThemeClasses(
            "absolute top-0 left-0 right-0 z-10",
            okayitTheme.backgrounds.glass
          )}
        >
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleClose}
              className="text-white hover:bg-white/20 font-bold"
            >
              <X className="w-6 h-6 mr-2" />
              Close
            </Button>
            
            <h1 className="text-white font-bold text-xl drop-shadow-lg">
              QR Scanner
            </h1>
            
            <div className="flex gap-2">
              {devices.length > 1 && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={switchCamera}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleFlash}
                className={`text-white hover:bg-white/20 ${isFlashOn ? 'bg-white/30' : ''}`}
              >
                <Flashlight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Scanning Interface */}
        {hasPermission === true && isScanning && !scanResult && (
          <ScanningOverlay />
        )}

        {/* Error State */}
        {(hasPermission === false || error) && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <Card className={combineThemeClasses("w-full max-w-md text-center", okayitTheme.backgrounds.modal)}>
              <CardContent className="p-8">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className={combineThemeClasses("text-2xl font-bold mb-3", okayitTheme.text.primary)}>
                  Camera Access Required
                </h3>
                <p className={combineThemeClasses("mb-6 text-lg", okayitTheme.text.secondary)}>
                  {error || 'Please allow camera access to scan QR codes'}
                </p>
                <Button
                  onClick={initializeCamera}
                  className={combineThemeClasses(okayitTheme.interactive.buttonPurple, "text-lg py-6 px-8")}
                  size="lg"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Success State */}
        {scanResult && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <Card className={combineThemeClasses("w-full max-w-md text-center", okayitTheme.backgrounds.modal)}>
              <CardContent className="p-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                </motion.div>
                <h3 className={combineThemeClasses("text-2xl font-bold mb-3", okayitTheme.text.primary)}>
                  QR Code Detected!
                </h3>
                <p className={combineThemeClasses("mb-3 text-xl font-semibold", okayitTheme.text.secondary)}>
                  {scanResult.location}
                </p>
                <Badge variant="secondary" className="mb-4 text-base px-4 py-2">
                  {scanResult.data.substring(0, 50)}
                  {scanResult.data.length > 50 ? '...' : ''}
                </Badge>
                <p className={combineThemeClasses("text-base", okayitTheme.text.muted)}>
                  Redirecting to location...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Bottom Controls */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className={combineThemeClasses(
            "absolute bottom-0 left-0 right-0",
            okayitTheme.backgrounds.glass
          )}
        >
          <div className="p-6">
            {/* Scan History */}
            {scanHistory.length > 0 && !scanResult && (
              <div className="mb-4">
                <h4 className="text-white font-bold text-lg mb-3 drop-shadow">
                  Recent Scans
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scanHistory.map((scan, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="whitespace-nowrap bg-white/20 text-white border-white/30 text-sm px-3 py-1"
                    >
                      {scan.location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-6">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="text-white hover:bg-white/20 rounded-2xl p-4 flex flex-col items-center transition-all">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm font-semibold">Upload</span>
                </div>
              </label>
              
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/20 rounded-2xl flex flex-col items-center h-auto py-4 px-6"
                onClick={() => {
                  cleanupCamera();
                  setTimeout(initializeCamera, 100);
                }}
              >
                <RotateCcw className="w-8 h-8 mb-2" />
                <span className="text-sm font-semibold">Reset</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
