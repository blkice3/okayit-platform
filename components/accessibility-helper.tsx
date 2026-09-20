
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Type,
  Volume2,
  MousePointer,
  Accessibility,
  ZoomIn,
  ZoomOut,
  Contrast,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function AccessibilityHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    largerButtons: false,
    screenReaderMode: false
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Save settings
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Apply settings
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 left-6 rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white z-40"
        title="Accessibility Settings"
      >
        <Accessibility className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Accessibility className="w-6 h-6" />
                      Accessibility Settings
                    </CardTitle>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-5 h-5 text-purple-600" />
                      <Label>Text Size: {settings.fontSize}px</Label>
                    </div>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={([value]) => setSettings({ ...settings, fontSize: value })}
                      min={12}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <Contrast className="w-5 h-5 text-purple-600" />
                      <Label>High Contrast Mode</Label>
                    </div>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
                    />
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-5 h-5 text-purple-600" />
                      <Label>Reduce Motion</Label>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => setSettings({ ...settings, reducedMotion: checked })}
                    />
                  </div>

                  {/* Larger Buttons */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-5 h-5 text-purple-600" />
                      <Label>Larger Click Targets</Label>
                    </div>
                    <Switch
                      checked={settings.largerButtons}
                      onCheckedChange={(checked) => setSettings({ ...settings, largerButtons: checked })}
                    />
                  </div>

                  {/* Screen Reader Mode */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-purple-600" />
                      <Label>Screen Reader Optimized</Label>
                    </div>
                    <Switch
                      checked={settings.screenReaderMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, screenReaderMode: checked })}
                    />
                  </div>

                  {/* Reset Button */}
                  <Button
                    onClick={() => setSettings({
                      fontSize: 16,
                      highContrast: false,
                      reducedMotion: false,
                      largerButtons: false,
                      screenReaderMode: false
                    })}
                    variant="outline"
                    className="w-full"
                  >
                    Reset to Defaults
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
