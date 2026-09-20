
'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { hapticFeedback } from '@/lib/mobile-utils';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  className?: string;
  disabled?: boolean;
}

export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onTap, 
  className = "",
  disabled = false 
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
    hapticFeedback.selection();
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (disabled) return;
    
    setIsDragging(false);
    const threshold = 100;
    
    if (info.offset.x > threshold && onSwipeRight) {
      hapticFeedback.impact('medium');
      onSwipeRight();
    } else if (info.offset.x < -threshold && onSwipeLeft) {
      hapticFeedback.impact('medium');
      onSwipeLeft();
    }
    
    x.set(0);
  };

  const handleTap = () => {
    if (disabled || isDragging) return;
    hapticFeedback.selection();
    onTap?.();
  };

  return (
    <motion.div
      drag={disabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      style={{ x, rotate, opacity }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer select-none ${className}`}
    >
      {children}
      
      {/* Swipe indicators */}
      {isDragging && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 font-bold pointer-events-none"
          >
            →
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 font-bold pointer-events-none"
          >
            ←
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  className?: string;
}

function PullToRefreshComponent({ 
  children, 
  onRefresh, 
  refreshThreshold = 80,
  className = ""
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  
  const pullIndicatorOpacity = useTransform(y, [0, refreshThreshold], [0, 1]);
  const pullIndicatorScale = useTransform(y, [0, refreshThreshold], [0.5, 1]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (info.offset.y > refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      hapticFeedback.impact('medium');
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        y.set(0);
        setPullDistance(0);
      }
    } else {
      y.set(0);
      setPullDistance(0);
    }
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const distance = Math.max(0, info.point.y);
    setPullDistance(distance);
    
    if (distance > 20 && distance < refreshThreshold) {
      hapticFeedback.selection();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      <motion.div
        style={{ 
          opacity: pullIndicatorOpacity,
          scale: pullIndicatorScale,
          y: Math.max(0, pullDistance - 40)
        }}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 p-4"
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={{ duration: isRefreshing ? 1 : 0, repeat: isRefreshing ? Infinity : 0 }}
          className="w-8 h-8 border border-indigo-500 border-t-transparent rounded-full"
        />
      </motion.div>

      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.3}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface LongPressButtonProps {
  children: ReactNode;
  onLongPress: () => void;
  onTap?: () => void;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

function LongPressButtonComponent({
  children,
  onLongPress,
  onTap,
  duration = 800,
  className = "",
  disabled = false
}: LongPressButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    if (disabled) return;
    
    setIsPressed(true);
    setProgress(0);
    hapticFeedback.selection();
    
    timeoutRef.current = setTimeout(() => {
      hapticFeedback.impact('heavy');
      onLongPress();
      setIsPressed(false);
      setProgress(0);
    }, duration);
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / (duration / 50)), 100));
    }, 50);
  };

  const handlePressEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (progress < 100 && onTap && !disabled) {
      onTap();
    }
    
    setIsPressed(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      whileTap={{ scale: 0.95 }}
      className={`relative cursor-pointer select-none ${className}`}
    >
      {children}
      
      {isPressed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
        >
          <div
            className="h-full bg-indigo-500 opacity-20 transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

interface PinchZoomProps {
  children: ReactNode;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
}

function PinchZoomComponent({ 
  children, 
  minZoom = 0.5, 
  maxZoom = 3,
  className = ""
}: PinchZoomProps) {
  const [scale, setScale] = useState(1);
  const [lastDistance, setLastDistance] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      if (lastDistance > 0) {
        const newScale = scale * (distance / lastDistance);
        const clampedScale = Math.min(maxZoom, Math.max(minZoom, newScale));
        setScale(clampedScale);
        
        if (clampedScale !== newScale) {
          hapticFeedback.impact('light');
        }
      }
      
      setLastDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setLastDistance(0);
  };

  const resetZoom = () => {
    setScale(1);
    hapticFeedback.impact('medium');
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={resetZoom}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="origin-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Export all gesture components
export const PullToRefresh = PullToRefreshComponent;
export const LongPressButton = LongPressButtonComponent;
export const PinchZoom = PinchZoomComponent;

export {
  SwipeableCard as default
};
