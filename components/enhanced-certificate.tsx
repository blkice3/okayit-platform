'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Award, Star, Sparkles, Medal, Trophy, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { okayitTheme } from '@/lib/okayit-theme';

interface EnhancedCertificateProps {
  userName: string;
  achievementTitle: string;
  completionDate?: string;
  certificateId?: string;
  signature?: string;
  homeContext?: string;
}

export default function EnhancedCertificate({
  userName,
  achievementTitle,
  completionDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
  certificateId = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  signature = 'House Manager',
  homeContext = 'OKAYiT Care Home'
}: EnhancedCertificateProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/generate-certificate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          achievementTitle,
          completionDate,
          certificateId,
          signature,
          homeContext
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative w-full max-w-4xl mx-auto"
    >
      {/* Premium Certificate Design */}
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-purple-50 p-8 md:p-12 rounded-3xl shadow-lg border-8 border-double border-amber-400">
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-32 h-32">
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-4 border-amber-500 rounded-tl-3xl"></div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32">
          <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-amber-500 rounded-tr-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32">
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-4 border-amber-500 rounded-bl-3xl"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-32 h-32">
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-amber-500 rounded-br-3xl"></div>
        </div>

        {/* Floating Decorative Icons */}
        <motion.div
          animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-8 right-16"
        >
          <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
        </motion.div>
        <motion.div
          animate={{ y: [5, -5, 5], rotate: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3.5 }}
          className="absolute top-12 left-16"
        >
          <Sparkles className="w-8 h-8 text-purple-400 fill-purple-400" />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Header Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center"
          >
            <div className="bg-gradient-to-br from-amber-400 to-yellow-600 p-6 rounded-full shadow-md">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-purple-600 to-blue-600 mb-2">
              CERTIFICATE
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-purple-700">
              OF ACHIEVEMENT
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            <Crown className="w-8 h-8 text-amber-500" />
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>

          {/* Achievement Text */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 py-6"
          >
            <p className="text-xl md:text-2xl text-gray-900 font-medium">
              This certificate is proudly presented to
            </p>
            
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-8 py-6 rounded-2xl border border-purple-300 shadow-lg">
              <h2 className="text-4xl md:text-6xl font-black text-purple-900">
                {userName}
              </h2>
            </div>

            <p className="text-xl md:text-2xl text-gray-900 font-medium">
              for successfully completing
            </p>

            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-8 py-6 rounded-2xl border border-amber-300 shadow-lg">
              <h3 className="text-3xl md:text-4xl font-black text-amber-900">
                {achievementTitle}
              </h3>
            </div>
          </motion.div>

          {/* Recognition Statement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="py-6"
          >
            <p className="text-lg md:text-xl text-gray-900 italic max-w-2xl mx-auto leading-relaxed">
              Your dedication, effort, and achievement are recognized and celebrated. 
              This milestone represents your growth, resilience, and success. 
              You should be incredibly proud!
            </p>
          </motion.div>

          {/* Footer Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t-2 border-amber-300"
          >
            {/* Date */}
            <div>
              <p className="text-sm text-gray-900 uppercase tracking-wider mb-2">Date of Completion</p>
              <p className="text-lg font-bold text-purple-700">{completionDate}</p>
            </div>

            {/* Signature */}
            <div>
              <p className="text-sm text-gray-900 uppercase tracking-wider mb-2">Authorized by</p>
              <div className="border-b-2 border-gray-800 pb-1 mb-2">
                <p className="text-2xl font-signature italic text-purple-900">{signature}</p>
              </div>
              <p className="text-xs text-gray-900">{homeContext}</p>
            </div>

            {/* Certificate ID */}
            <div>
              <p className="text-sm text-gray-900 uppercase tracking-wider mb-2">Certificate ID</p>
              <p className="text-lg font-mono font-bold text-purple-700">{certificateId}</p>
              <div className="flex justify-center gap-2 mt-2">
                <Medal className="w-5 h-5 text-amber-500" />
                <Medal className="w-5 h-5 text-amber-500" />
                <Medal className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </motion.div>

          {/* Official Seal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.1, type: "spring" }}
            className="absolute -bottom-6 right-8 md:right-16"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 shadow-md flex items-center justify-center border border-white">
              <div className="text-center">
                <Award className="w-10 h-10 text-white mx-auto mb-1" />
                <p className="text-xs font-black text-white">OFFICIAL</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap gap-4 justify-center mt-8"
      >
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="lg"
          className={okayitTheme.interactive.buttonGreen}
        >
          {isDownloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Download className="w-5 h-5" />
              </motion.div>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download Certificate
            </>
          )}
        </Button>

        <Button
          onClick={() => window.print()}
          size="lg"
          variant="outline"
          className="border border-purple-500 text-purple-700 hover:bg-purple-50"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Print Certificate
        </Button>
      </motion.div>
    </motion.div>
  );
}
