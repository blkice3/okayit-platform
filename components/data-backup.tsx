'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Upload, Shield, AlertTriangle,
  CheckCircle, FileText, HardDrive, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// All localStorage keys used by the platform for user data
const DATA_KEYS = [
  { key: 'okayit_private_journal', label: 'Journal Entries' },
  { key: 'okayit_important_info', label: 'Important People & Dates' },
  { key: 'okayit_mood_history', label: 'Mood History' },
  { key: 'okayit_progress_data', label: 'Progress' },
  { key: 'okayit_safety_plan', label: 'Safety Plan' },
  { key: 'saved_works', label: 'Saved Work' },
  { key: 'reflectionToolkit', label: 'Reflections' },
  { key: 'enhanced_gaming_data', label: 'Game Progress' },
  { key: 'user-certificates', label: 'Certificates' },
  { key: 'user_name', label: 'Your Name' },
  { key: 'selected_home', label: 'Selected Home' },
];

interface DataBackupProps {
  onBack: () => void;
}

export default function DataBackup({ onBack }: DataBackupProps) {
  const [mounted, setMounted] = useState(false);
  const [dataCounts, setDataCounts] = useState<Record<string, number>>({});
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    countData();
  }, []);

  const countData = () => {
    const counts: Record<string, number> = {};
    DATA_KEYS.forEach(({ key }) => {
      try {
        const val = localStorage.getItem(key);
        if (!val) { counts[key] = 0; return; }
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) counts[key] = parsed.length;
        else if (typeof parsed === 'object' && parsed !== null) {
          // Count sub-arrays inside objects (e.g. important_info has contacts + dates)
          const subCounts = Object.values(parsed).reduce((sum: number, v) => {
            return sum + (Array.isArray(v) ? v.length : 1);
          }, 0);
          counts[key] = subCounts as number;
        }
        else counts[key] = 1;
      } catch {
        counts[key] = localStorage.getItem(key) ? 1 : 0;
      }
    });
    setDataCounts(counts);
  };

  const totalItems = Object.values(dataCounts).reduce((a, b) => a + b, 0);

  const handleExport = () => {
    try {
      const exportData: Record<string, unknown> = {
        _meta: {
          platform: 'OKAYiT',
          exportedAt: new Date().toISOString(),
          version: 1,
        }
      };

      DATA_KEYS.forEach(({ key }) => {
        const val = localStorage.getItem(key);
        if (val) {
          try { exportData[key] = JSON.parse(val); }
          catch { exportData[key] = val; }
        }
      });

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `okayit-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Backup downloaded!', { description: 'Keep this file somewhere safe.' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);

        // Basic validation
        if (!data._meta || data._meta.platform !== 'OKAYiT') {
          setImportStatus('error');
          toast.error('This does not look like an OKAYiT backup file.');
          return;
        }

        // Restore each key
        let restored = 0;
        DATA_KEYS.forEach(({ key }) => {
          if (data[key] !== undefined) {
            try {
              const val = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
              localStorage.setItem(key, val);
              restored++;
            } catch { /* skip invalid */ }
          }
        });

        setImportStatus('success');
        countData();
        toast.success(`Restored ${restored} items from backup!`);
      } catch {
        setImportStatus('error');
        toast.error('Could not read this file. Make sure it is a valid OKAYiT backup.');
      }
    };
    reader.readAsText(file);

    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold flex items-center gap-1 hover:text-purple-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Menu
          </button>
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-gray-800">Backup My Data</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

            {/* Why backup matters */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-amber-800 font-bold mb-0.5">Why back up?</p>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Your journal, contacts, mood history, and progress are stored on this device. If the browser data is cleared or you switch devices, this information could be lost. Downloading a backup keeps it safe.
                  </p>
                </div>
              </div>
            </div>

            {/* What you have */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Your Data ({totalItems} items)</h3>
              <div className="space-y-1.5">
                {DATA_KEYS.map(({ key, label }) => {
                  const count = dataCounts[key] || 0;
                  if (count === 0) return null;
                  return (
                    <div key={key} className="flex items-center gap-3 px-3 py-2 rounded-xl border border-gray-200 bg-white">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50 flex-shrink-0">
                        <FileText className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{label}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                    </div>
                  );
                })}
                {totalItems === 0 && (
                  <div className="text-center py-6">
                    <HardDrive className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No data saved yet. Use the platform and come back to back it up.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Export */}
            <div className="mb-4">
              <button
                onClick={handleExport}
                disabled={totalItems === 0}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-green-300 bg-green-50 hover:bg-green-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-sm">
                  <Download className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-green-800">Download Backup</p>
                  <p className="text-xs text-gray-600">Saves a file to your device that you can keep safe</p>
                </div>
              </button>
            </div>

            {/* Import */}
            <div className="mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-sm">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-blue-800">Restore From Backup</p>
                  <p className="text-xs text-gray-600">Load a backup file you saved earlier</p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>

            {/* Import status */}
            {importStatus === 'success' && (
              <div className="bg-green-50 border border-green-300 rounded-xl p-3 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-700 font-medium">Backup restored successfully. Refresh the page to see your data.</p>
              </div>
            )}
            {importStatus === 'error' && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="text-xs text-red-700 font-medium">Could not restore from that file. Make sure it is a valid OKAYiT backup.</p>
              </div>
            )}

            {/* Safety note */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-purple-700 font-medium leading-relaxed">
                  Your backup file contains only the data from this platform. It does not include passwords or anything that could identify you to others. You can ask a trusted adult to help you store it safely.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
