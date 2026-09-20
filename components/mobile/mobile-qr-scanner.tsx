
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera,
  X,
  Flashlight,
  RotateCcw,
  Image,
  Zap,
  CheckCircle,
  AlertCircle,
  QrCode,
  ScanLine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QRScanner, hapticFeedback, device } from '@/lib/mobile-utils';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface MobileQRScannerProps {
  onClose: () => void;
  onQRDetected: (data: string) => void;
  isOpen: boolean;
}

interface QRScanResult {
  data: string;
  timestamp: number;
  location?: string;
}

export default function MobileQRScanner({ onClose, onQRDetected, isOpen }: MobileQRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerRef = useRef<QRScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<QRScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && device.hasCamera()) {
      initializeScanner();
    }
    
    return () => {
      cleanupScanner();
    };
  }, [isOpen]);

  const initializeScanner = async () => {
    try {
      if (!videoRef.current || !canvasRef.current) return;

      scannerRef.current = new QRScanner();
      const success = await scannerRef.current.initialize(videoRef.current, canvasRef.current);
      
      if (success) {
        setHasPermission(true);
        setIsScanning(true);
        hapticFeedback.impact('light');
        
        scannerRef.current.startScanning((data) => {
          handleQRDetected(data);
        });
      } else {
        setHasPermission(false);
        setError('Camera access denied');
      }
    } catch (err) {
      console.error('Scanner initialization failed:', err);
      setError('Failed to initialize camera');
      setHasPermission(false);
    }
  };

  const cleanupScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQRDetected = (data: string) => {
    const result: QRScanResult = {
      data,
      timestamp: Date.now(),
      location: getLocationFromQR(data)
    };

    setScanResult(result);
    setScanHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 scans
    hapticFeedback.notification('success');
    
    setTimeout(() => {
      onQRDetected(data);
      handleClose();
    }, 1500);
  };

  const getLocationFromQR = (data: string): string => {
    // Parse QR data to extract location info
    if (data.includes('room-')) {
      const roomNumber = data.split('-')[1];
      const roomNames: Record<string, string> = {
        '1': 'Living Room',
        '2': 'Kitchen',
        '3': 'Bedroom 1',
        '4': 'Bedroom 2',
        '5': 'Bathroom',
        '6': 'Garden',
        '7': 'Study Room',
        '8': 'Dining Room',
        '9': 'Office',
        '10': 'Common Area'
      };
      return roomNames[roomNumber] || `Room ${roomNumber}`;
    }
    return 'Unknown Location';
  };

  const handleClose = () => {
    cleanupScanner();
    onClose();
  };

  const toggleFlash = async () => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        const track = stream.getVideoTracks()[0];
        if (track && 'torch' in track.getCapabilities()) {
          await track.applyConstraints({
            // @ts-ignore
            advanced: [{ torch: !isFlashOn }]
          });
          setIsFlashOn(!isFlashOn);
          hapticFeedback.selection();
        }
      }
    } catch (err) {
      console.error('Flash toggle failed:', err);
    }
  };

  const ScanningOverlay = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Scanning frame */}
        <div className="w-64 h-64 border border-white/50 rounded-2xl relative overflow-hidden">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-2 border-indigo-400 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-2 border-indigo-400 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-lg"></div>
          
          {/* Scanning line animation */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 280 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
          />
        </div>
        
        {/* Instructions */}
        <div className="mt-6 text-center">
          <QrCode className="w-8 h-8 mx-auto mb-2 text-white/80" />
          <p className="text-white font-semibold drop-shadow-lg">
            Point camera at QR code
          </p>
          <p className="text-white/70 text-sm mt-1 drop-shadow">
            Hold steady for best results
          </p>
        </div>
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
            "absolute top-0 left-0 right-0 pt-safe-top z-10",
            okayitTheme.backgrounds.glass
          )}
        >
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <h1 className="text-white font-bold text-lg drop-shadow-lg">
              QR Scanner
            </h1>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFlash}
              className={`text-white hover:bg-white/10 ${isFlashOn ? 'bg-white/20' : ''}`}
            >
              <Flashlight className="w-6 h-6" />
            </Button>
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
            <Card className={combineThemeClasses("w-full max-w-sm text-center", okayitTheme.backgrounds.modal)}>
              <CardContent className="p-6">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className={combineThemeClasses("text-lg font-bold mb-2", okayitTheme.text.primary)}>
                  Camera Access Required
                </h3>
                <p className={combineThemeClasses("mb-4", okayitTheme.text.secondary)}>
                  {error || 'Please allow camera access to scan QR codes'}
                </p>
                <Button
                  onClick={initializeScanner}
                  className={okayitTheme.interactive.button}
                >
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
            <Card className={combineThemeClasses("w-full max-w-sm text-center", okayitTheme.backgrounds.modal)}>
              <CardContent className="p-6">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className={combineThemeClasses("text-lg font-bold mb-2", okayitTheme.text.primary)}>
                  QR Code Detected!
                </h3>
                <p className={combineThemeClasses("mb-2", okayitTheme.text.secondary)}>
                  {scanResult.location}
                </p>
                <Badge variant="secondary" className="mb-4">
                  {scanResult.data}
                </Badge>
                <p className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
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
            "absolute bottom-0 left-0 right-0 pb-safe-bottom",
            okayitTheme.backgrounds.glass
          )}
        >
          <div className="p-6">
            {/* Scan History */}
            {scanHistory.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2 drop-shadow">
                  Recent Scans
                </h4>
                <div className="flex space-x-2 overflow-x-auto">
                  {scanHistory.map((scan, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="whitespace-nowrap bg-white/20 text-white border-white/30"
                    >
                      {scan.location}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 flex flex-col items-center"
                onClick={() => {
                  // Simulate image upload for QR scanning
                  hapticFeedback.selection();
                }}
              >
                <Image className="w-6 h-6" />
                <span className="text-xs mt-1">Gallery</span>
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 flex flex-col items-center"
                onClick={() => {
                  cleanupScanner();
                  setTimeout(initializeScanner, 100);
                  hapticFeedback.selection();
                }}
              >
                <RotateCcw className="w-6 h-6" />
                <span className="text-xs mt-1">Reset</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
