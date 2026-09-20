

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, X, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { okayitTheme, tikTokTransitions } from '@/lib/okayit-theme';

interface EnhancedWelcomeVideoProps {
  videoUrl: string;
  homeName: string;
  onComplete?: () => void;
  onClose?: () => void;
}

export default function EnhancedWelcomeVideo({ videoUrl, homeName, onComplete, onClose }: EnhancedWelcomeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  return (
    <motion.div
      {...tikTokTransitions.scaleIn}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
      onMouseMove={handleMouseMove}
    >
      <Card className={`${okayitTheme.backgrounds.modal} max-w-6xl w-full overflow-hidden relative`}>
        {/* Close Button */}
        {onClose && (
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white text-slate-900 shadow-lg"
            variant="ghost"
          >
            <X className="w-6 h-6" />
          </Button>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to {homeName}</h2>
          <p className="text-blue-100 text-lg">Watch this special video to learn about your new home</p>
        </div>

        {/* Video Container */}
        <div className="relative bg-black aspect-video group">
          {isYouTube ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                onClick={togglePlay}
              />

              {/* Custom Video Controls */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
              >
                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                  <Button
                    onClick={togglePlay}
                    className="w-24 h-24 rounded-full bg-blue-600/90 hover:bg-blue-700 text-white shadow-lg pointer-events-auto backdrop-blur-sm"
                  >
                    {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-2" />}
                  </Button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleSeek}
                      className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={togglePlay}
                        className="rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white text-slate-900"
                        variant="ghost"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </Button>

                      <Button
                        onClick={restart}
                        className="rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white text-slate-900"
                        variant="ghost"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>

                      <Button
                        onClick={skipForward}
                        className="rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white text-slate-900"
                        variant="ghost"
                      >
                        <SkipForward className="w-5 h-5" />
                      </Button>

                      <Button
                        onClick={toggleMute}
                        className="rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white text-slate-900"
                        variant="ghost"
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </Button>

                      <span className="text-white font-semibold text-lg">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <Button
                      onClick={toggleFullscreen}
                      className="rounded-full w-12 h-12 p-0 bg-white/90 hover:bg-white text-slate-900"
                      variant="ghost"
                    >
                      <Maximize className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Footer with encouragement */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
          <p className={`${okayitTheme.text.primary} text-center text-lg`}>
            Take your time watching this video - it's made especially for you
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
