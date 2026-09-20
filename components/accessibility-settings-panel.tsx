'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, X, Type, Contrast, MousePointer, Accessibility,
  Volume2, Eye, Zap, Moon, Sun, Languages, Save, RotateCcw,
  CheckCircle, Info
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  darkMode: boolean;
  dyslexicFont: boolean;
  largerClickTargets: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  textSpacing: number;
  colorBlindMode: string;
  soundEffects: boolean;
  autoPlayVideos: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  reduceMotion: false,
  darkMode: false,
  dyslexicFont: false,
  largerClickTargets: false,
  screenReaderOptimized: false,
  keyboardNavigation: true,
  textSpacing: 1,
  colorBlindMode: 'none',
  soundEffects: true,
  autoPlayVideos: true
};

const loadSettings = (): AccessibilitySettings => {
  if (typeof window === 'undefined') return defaultSettings;
  
  const stored = localStorage.getItem('okayit_accessibility_settings');
  if (stored) {
    return { ...defaultSettings, ...JSON.parse(stored) };
  }
  return defaultSettings;
};

const saveSettings = (settings: AccessibilitySettings) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('okayit_accessibility_settings', JSON.stringify(settings));
    applySettings(settings);
  }
};

const applySettings = (settings: AccessibilitySettings) => {
  const root = document.documentElement;
  
  // Font size
  root.style.fontSize = `${settings.fontSize}px`;
  
  // High contrast
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // Reduce motion
  if (settings.reduceMotion) {
    root.classList.add('reduce-motion');
  } else {
    root.classList.remove('reduce-motion');
  }
  
  // Dark mode
  if (settings.darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Dyslexic font
  if (settings.dyslexicFont) {
    root.classList.add('dyslexic-font');
  } else {
    root.classList.remove('dyslexic-font');
  }
  
  // Larger click targets
  if (settings.largerClickTargets) {
    root.classList.add('large-click-targets');
  } else {
    root.classList.remove('large-click-targets');
  }
  
  // Text spacing
  root.style.setProperty('--text-spacing', settings.textSpacing.toString());
  
  // Color blind mode
  if (settings.colorBlindMode !== 'none') {
    root.classList.add(`color-blind-${settings.colorBlindMode}`);
  } else {
    root.classList.forEach(className => {
      if (className.startsWith('color-blind-')) {
        root.classList.remove(className);
      }
    });
  }
};

interface AccessibilitySettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean; // When true, render as a full-page component instead of slide-out
}

export default function AccessibilitySettingsPanel({ isOpen: externalIsOpen, onClose: externalOnClose, inline = false }: AccessibilitySettingsPanelProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const handleClose = externalOnClose || (() => setInternalIsOpen(false));
  const handleToggle = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(prev => !prev);
    }
  };

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [externalIsOpen, externalOnClose]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  const handleSave = () => {
    saveSettings(settings);
    toast.success('Accessibility settings saved!', {
      description: 'Your preferences have been applied.',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
    toast.success('Settings reset to defaults');
  };

  // Inline content for full-page rendering
  const settingsContent = (
    <div className="space-y-6">
      {/* Visual Settings */}
      <Card className="border border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Eye className="w-5 h-5 text-blue-600" />
            Visual Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-gray-900">Text Size</Label>
              <span className="text-sm font-bold text-blue-600">{settings.fontSize}px</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSetting('fontSize', value)}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-gray-700">Adjust the base text size across the platform</p>
          </div>

          {/* Text Spacing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-gray-900">Text Spacing</Label>
              <span className="text-sm font-bold text-blue-600">{settings.textSpacing}x</span>
            </div>
            <Slider
              value={[settings.textSpacing]}
              onValueChange={([value]) => updateSetting('textSpacing', value)}
              min={1}
              max={2}
              step={0.1}
              className="w-full"
            />
            <p className="text-sm text-gray-700">Increase spacing for better readability</p>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-gray-900">High Contrast Mode</Label>
              <p className="text-sm text-gray-700">Enhance color contrast for better visibility</p>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold flex items-center gap-2 text-gray-900">
                <Moon className="w-4 h-4" />
                Dark Mode
              </Label>
              <p className="text-sm text-gray-700">Reduce eye strain in low light</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
          </div>

          {/* Dyslexic Font */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-gray-900">Dyslexia-Friendly Font</Label>
              <p className="text-sm text-gray-700">Use OpenDyslexic font for easier reading</p>
            </div>
            <Switch
              checked={settings.dyslexicFont}
              onCheckedChange={(checked) => updateSetting('dyslexicFont', checked)}
            />
          </div>

          {/* Color Blind Mode */}
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <Label className="text-base font-semibold text-gray-900">Color Blind Mode</Label>
            <Select
              value={settings.colorBlindMode}
              onValueChange={(value) => updateSetting('colorBlindMode', value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No adjustment</SelectItem>
                <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Motion & Animation */}
      <Card className="border border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Zap className="w-5 h-5 text-purple-600" />
            Motion & Animation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-gray-900">Reduce Motion</Label>
              <p className="text-sm text-gray-700">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-gray-900">Auto-play Videos</Label>
              <p className="text-sm text-gray-700">Automatically play video content</p>
            </div>
            <Switch
              checked={settings.autoPlayVideos}
              onCheckedChange={(checked) => updateSetting('autoPlayVideos', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Interaction */}
      <Card className="border border-green-200">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MousePointer className="w-5 h-5 text-green-600" />
            Interaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-gray-900">Larger Click Targets</Label>
              <p className="text-sm text-gray-700">Make buttons and links easier to tap</p>
            </div>
            <Switch
              checked={settings.largerClickTargets}
              onCheckedChange={(checked) => updateSetting('largerClickTargets', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-gray-900">Enhanced Keyboard Navigation</Label>
              <p className="text-sm text-gray-700">Improve focus indicators and shortcuts</p>
            </div>
            <Switch
              checked={settings.keyboardNavigation}
              onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-gray-900">Screen Reader Optimization</Label>
              <p className="text-sm text-gray-700">Enhance compatibility with screen readers</p>
            </div>
            <Switch
              checked={settings.screenReaderOptimized}
              onCheckedChange={(checked) => updateSetting('screenReaderOptimized', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save/Reset Buttons */}
      <div className="flex gap-4 pt-4">
        <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3">
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1 font-bold py-3">
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );

  // Render inline if specified
  if (inline && isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md border border-blue-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Accessibility className="w-10 h-10" />
            <div>
              <h2 className="text-3xl font-black">Accessibility Settings</h2>
              <p className="text-blue-100">Customize your experience for better usability</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {settingsContent}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Floating button removed - accessibility can be accessed from menu */}

      {/* Settings Panel (Slide-out mode) */}
      <AnimatePresence>
        {isOpen && !inline && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-lg z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Accessibility className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-black">Accessibility Settings</h2>
                      <p className="text-sm text-blue-100">Customize your experience</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Visual Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Visual Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Font Size */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Text Size</Label>
                        <span className="text-sm text-gray-800">{settings.fontSize}px</span>
                      </div>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={([value]) => updateSetting('fontSize', value)}
                        min={12}
                        max={24}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-900">Adjust the base text size across the platform</p>
                    </div>

                    {/* Text Spacing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Text Spacing</Label>
                        <span className="text-sm text-gray-800">{settings.textSpacing}x</span>
                      </div>
                      <Slider
                        value={[settings.textSpacing]}
                        onValueChange={([value]) => updateSetting('textSpacing', value)}
                        min={1}
                        max={2}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-900">Increase spacing for better readability</p>
                    </div>

                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">High Contrast Mode</Label>
                        <p className="text-sm text-gray-900">Enhance color contrast for better visibility</p>
                      </div>
                      <Switch
                        checked={settings.highContrast}
                        onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                      />
                    </div>

                    {/* Dark Mode */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark Mode
                        </Label>
                        <p className="text-sm text-gray-900">Reduce eye strain in low light</p>
                      </div>
                      <Switch
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                      />
                    </div>

                    {/* Dyslexic Font */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">Dyslexia-Friendly Font</Label>
                        <p className="text-sm text-gray-900">Use OpenDyslexic font for easier reading</p>
                      </div>
                      <Switch
                        checked={settings.dyslexicFont}
                        onCheckedChange={(checked) => updateSetting('dyslexicFont', checked)}
                      />
                    </div>

                    {/* Color Blind Mode */}
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Color Blind Mode</Label>
                      <Select
                        value={settings.colorBlindMode}
                        onValueChange={(value) => updateSetting('colorBlindMode', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No adjustment</SelectItem>
                          <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                          <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                          <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Motion & Animation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Motion & Animation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">Reduce Motion</Label>
                        <p className="text-sm text-gray-900">Minimize animations and transitions</p>
                      </div>
                      <Switch
                        checked={settings.reduceMotion}
                        onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">Auto-play Videos</Label>
                        <p className="text-sm text-gray-900">Automatically play video content</p>
                      </div>
                      <Switch
                        checked={settings.autoPlayVideos}
                        onCheckedChange={(checked) => updateSetting('autoPlayVideos', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Interaction */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MousePointer className="w-5 h-5" />
                      Interaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">Larger Click Targets</Label>
                        <p className="text-sm text-gray-900">Make buttons and links easier to tap</p>
                      </div>
                      <Switch
                        checked={settings.largerClickTargets}
                        onCheckedChange={(checked) => updateSetting('largerClickTargets', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">Enhanced Keyboard Navigation</Label>
                        <p className="text-sm text-gray-900">Improve focus indicators and shortcuts</p>
                      </div>
                      <Switch
                        checked={settings.keyboardNavigation}
                        onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">Screen Reader Optimization</Label>
                        <p className="text-sm text-gray-900">Enhance compatibility with screen readers</p>
                      </div>
                      <Switch
                        checked={settings.screenReaderOptimized}
                        onCheckedChange={(checked) => updateSetting('screenReaderOptimized', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold">Sound Effects</Label>
                        <p className="text-sm text-gray-900">Play audio feedback for interactions</p>
                      </div>
                      <Switch
                        checked={settings.soundEffects}
                        onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Info Card */}
                <Card className={okayitTheme.backgrounds.blueCard}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-6 h-6 text-blue-700 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-blue-900 mb-2">Keyboard Shortcut</h3>
                        <p className="text-sm text-blue-800">
                          Press <kbd className="px-2 py-1 bg-white/50 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-white/50 rounded">A</kbd> to open this panel anytime
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t p-6 shadow-lg">
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    size="lg"
                    className={`flex-1 ${okayitTheme.interactive.buttonGreen}`}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Settings
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Export function to get current settings
export const getAccessibilitySettings = (): AccessibilitySettings => {
  return loadSettings();
};

// Export function to apply settings on page load
export const initializeAccessibility = () => {
  if (typeof window !== 'undefined') {
    const settings = loadSettings();
    applySettings(settings);
  }
};
