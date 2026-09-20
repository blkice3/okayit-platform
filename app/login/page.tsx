'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, KeyRound, Mail, Lock, ArrowLeft, Eye, EyeOff,
  Loader2, AlertCircle, Sparkles, Heart, User, Building2,
  CheckCircle2, Clock, Chrome, Home, BookOpen, Users,
  Phone, Star, Target, ArrowRight, Smile, PartyPopper
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OKAYiTLogo from '@/components/okayit-logo';

const INTRO_STORAGE_KEY = 'okayit_intro_seen';
const INTRO_TOTAL = 5;
const SWIPE_THRESHOLD = 50;

type Mode = 'choose' | 'staff' | 'young-person' | 'signup' | 'pending';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  const [mode, setMode] = useState<Mode>('choose');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [redirectedFromLogin, setRedirectedFromLogin] = useState(false);

  // Staff form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // YP form
  const [inviteCode, setInviteCode] = useState('');

  // Signup form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupCareHome, setSignupCareHome] = useState('');
  const [careHomes, setCareHomes] = useState<Array<{ id: string; displayName: string }>>([]);

  // Intro slides state
  const [showIntro, setShowIntro] = useState(false);
  const [introSlide, setIntroSlide] = useState(0);
  const [introDirection, setIntroDirection] = useState(1);
  const [introReady, setIntroReady] = useState(false);
  const introTouchStart = useRef<number | null>(null);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(INTRO_STORAGE_KEY);
      if (seen !== 'true' && !errorParam) {
        setShowIntro(true);
      }
    } catch {}
    setIntroReady(true);
  }, [errorParam]);

  const finishIntro = useCallback(() => {
    try { localStorage.setItem(INTRO_STORAGE_KEY, 'true'); } catch {}
    setShowIntro(false);
  }, []);

  const introNext = useCallback(() => {
    if (introSlide >= INTRO_TOTAL - 1) { finishIntro(); return; }
    setIntroDirection(1);
    setIntroSlide(s => s + 1);
  }, [introSlide, finishIntro]);

  const introPrev = useCallback(() => {
    setIntroDirection(-1);
    setIntroSlide(s => Math.max(0, s - 1));
  }, []);

  const introSlideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  // Handle URL error params (including Google SSO errors)
  useEffect(() => {
    if (errorParam === 'pending_approval') {
      setMode('pending');
    } else if (errorParam === 'account_suspended') {
      setError('Your account has been suspended. Please contact your administrator.');
    } else if (errorParam === 'account_archived') {
      setError('This account is no longer active. Please contact your care home manager.');
    } else if (errorParam === 'OAuthAccountNotLinked') {
      setError('This email is already linked to another sign-in method. Try logging in with your email and password instead.');
    } else if (errorParam === 'OAuthCallbackError' || errorParam === 'OAuthSignin' || errorParam === 'OAuthCreateAccount') {
      setError('Google sign-in is temporarily unavailable. Please use email and password to sign in, or create an account below.');
      setMode('staff');
    } else if (errorParam === 'Callback') {
      setError('Sign in was interrupted. Please try again.');
    } else if (errorParam) {
      setError('Sign in failed. Please try again or create an account.');
    }
  }, [errorParam]);

  // Load care homes for signup
  useEffect(() => {
    if (mode === 'signup' && careHomes.length === 0) {
      fetch('/api/care-homes?public=true')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.data) {
            setCareHomes(data.data.map((h: any) => ({ id: h.id, displayName: h.displayName })));
          }
        })
        .catch(() => {});
    }
  }, [mode, careHomes.length]);

  useEffect(() => {
    setError(null);
    if (mode !== 'signup') setRedirectedFromLogin(false);
  }, [mode]);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('email-password', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes('no_account')) {
          // No account found — redirect to signup with pre-filled email
          setSignupEmail(email.toLowerCase().trim());
          setRedirectedFromLogin(true);
          setMode('signup');
        } else if (result.error.includes('wrong_password')) {
          setError('Incorrect password. Please try again.');
        } else if (result.error.includes('yp_use_invite')) {
          setError('Young people sign in using an invite code from their key worker.');
          setMode('choose');
        } else if (result.error.includes('account_inactive')) {
          setError('This account is no longer active. Please contact your care home manager.');
        } else {
          setError('Login failed. Check your details and try again.');
        }
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleInviteCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = inviteCode.toUpperCase().trim();
    if (code.length !== 6) {
      setError('Invite codes are 6 characters long.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('invite-code', {
        code,
        redirect: false,
      });

      if (result?.error) {
        setError('That code didn\u2019t work. It might be expired or already used. Ask your key worker for a new one.');
      } else if (result?.ok) {
        router.replace('/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match.');
      return;
    }
    if (signupPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.toLowerCase().trim(),
          password: signupPassword,
          careHomeId: signupCareHome || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
      } else {
        setSignupSuccess(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google icon SVG
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  // ── Intro Slides Content ──
  const introSlides: React.ReactNode[] = [
    // Slide 0 — Welcome
    <div key="intro0" className="flex flex-col items-center text-center gap-5 px-4">
      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
        <OKAYiTLogo width={100} height={100} />
      </motion.div>
      <h1 className="text-3xl font-extrabold text-purple-700 leading-tight">Welcome to OKAYiT!</h1>
      <p className="text-lg text-gray-600 max-w-md leading-relaxed">
        This is <strong>your space</strong>, made just for young people in care. Let us show you what it&apos;s all about!
      </p>
      <motion.button onClick={introNext} className="flex items-center gap-2 text-purple-500 font-semibold text-sm cursor-pointer hover:text-purple-700 transition-colors" animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        <Sparkles className="w-4 h-4" /> Swipe or tap to start <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>,
    // Slide 1 — What is OKAYiT?
    <div key="intro1" className="flex flex-col items-center text-center gap-4 px-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center"><Home className="w-8 h-8 text-blue-600" /></div>
      <h2 className="text-2xl font-bold text-gray-800">What is OKAYiT?</h2>
      <p className="text-base text-gray-600 max-w-md leading-relaxed">A friendly digital platform for young people in residential care. Your own pocket guide to your home.</p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-2">
        {[
          { icon: Heart, label: 'Check in with\nyour feelings', bg: 'bg-pink-50', border: 'border-pink-200', iconColor: 'text-pink-500', textColor: 'text-pink-700' },
          { icon: Shield, label: 'Know your\nrights', bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500', textColor: 'text-green-700' },
          { icon: Users, label: 'Meet the\nteam', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', textColor: 'text-blue-700' },
          { icon: BookOpen, label: 'Write in your\nprivate journal', bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'text-purple-500', textColor: 'text-purple-700' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }} className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center ${item.bg} ${item.border}`}>
            <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            <span className={`text-xs font-semibold ${item.textColor} whitespace-pre-line`}>{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>,
    // Slide 2 — Your safe space
    <div key="intro2" className="flex flex-col items-center text-center gap-4 px-4">
      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center"><Shield className="w-8 h-8 text-green-600" /></div>
      <h2 className="text-2xl font-bold text-gray-800">Your Safe Space</h2>
      <p className="text-base text-gray-600 max-w-md leading-relaxed">Everything here is private and just for you. Your journal, your feelings, your thoughts. No one else can see them.</p>
      <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 max-w-sm">
        <p className="text-sm text-green-700 font-medium">🔒 Your data is protected and secure. Only you decide what to share.</p>
      </div>
    </div>,
    // Slide 3 — What you can do
    <div key="intro3" className="flex flex-col items-center text-center gap-4 px-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center"><Target className="w-8 h-8 text-orange-600" /></div>
      <h2 className="text-2xl font-bold text-gray-800">Here&apos;s what you can do</h2>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {[
          { icon: Heart, label: 'Daily Check-In', desc: 'Tell us how you are feeling', bg: 'bg-pink-50', border: 'border-pink-200', iconColor: 'text-pink-500', textColor: 'text-pink-700' },
          { icon: BookOpen, label: 'Private Journal', desc: 'Your thoughts. No one else sees them', bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'text-purple-500', textColor: 'text-purple-700' },
          { icon: Shield, label: 'Safety Plan', desc: 'People and places that help you feel safe', bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500', textColor: 'text-green-700' },
          { icon: Phone, label: 'Get Help Anytime', desc: 'Helplines whenever you need them', bg: 'bg-red-50', border: 'border-red-200', iconColor: 'text-red-500', textColor: 'text-red-700' },
          { icon: Star, label: 'Certificates', desc: 'Earn achievements as you explore', bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', textColor: 'text-amber-700' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className={`flex items-center gap-3 rounded-xl p-3 ${item.bg} border ${item.border} text-left`}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-sm flex-shrink-0"><item.icon className={`w-5 h-5 ${item.iconColor}`} /></div>
            <div className="min-w-0"><p className={`text-sm font-bold ${item.textColor}`}>{item.label}</p><p className="text-xs text-gray-600 truncate">{item.desc}</p></div>
          </motion.div>
        ))}
      </div>
    </div>,
    // Slide 4 — Ready to start
    <div key="intro4" className="flex flex-col items-center text-center gap-5 px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -10, 10, 0] }} transition={{ type: 'spring', damping: 8, stiffness: 120 }}>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800">Ready to get started!</h2>
      <p className="text-base text-gray-600 max-w-md leading-relaxed">Sign in or create an account to begin your OKAYiT journey. Your care team may have given you an invite code.</p>
      <div className="bg-purple-50 border border-purple-200 rounded-xl px-5 py-3 max-w-sm">
        <p className="text-sm text-purple-700 font-medium">💜 If you ever need help, tap &quot;Get Help Anytime&quot;. Someone is always there.</p>
      </div>
    </div>,
  ];

  if (!introReady) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" />;
  }

  // ── Show intro slides before login ──
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <div className="flex justify-end p-4">
          <button onClick={finishIntro} className="text-sm text-gray-400 hover:text-purple-600 transition-colors font-medium">Skip intro →</button>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center px-4 overflow-hidden"
          onTouchStart={(e) => { introTouchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (introTouchStart.current === null) return;
            const diff = introTouchStart.current - e.changedTouches[0].clientX;
            introTouchStart.current = null;
            if (Math.abs(diff) > SWIPE_THRESHOLD) { diff > 0 ? introNext() : introPrev(); }
          }}
        >
          <AnimatePresence mode="wait" custom={introDirection}>
            <motion.div
              key={introSlide}
              custom={introDirection}
              variants={introSlideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              {introSlides[introSlide]}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Dots + nav */}
        <div className="pb-8 pt-4 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {Array.from({ length: INTRO_TOTAL }).map((_, i) => (
              <button key={i} onClick={() => { setIntroDirection(i > introSlide ? 1 : -1); setIntroSlide(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === introSlide ? 'bg-purple-600 w-6' : i < introSlide ? 'bg-purple-300' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {introSlide > 0 && (
              <Button variant="outline" size="sm" onClick={introPrev} className="rounded-full px-4 font-bold">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button size="sm" onClick={introNext} className="rounded-full px-6 font-bold bg-purple-600 hover:bg-purple-700 text-white">
              {introSlide === INTRO_TOTAL - 1 ? <>Let&apos;s go! <Sparkles className="w-4 h-4 ml-1" /></> : <>Next <ArrowRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <OKAYiTLogo width={80} height={80} />
          </div>
          <p className="text-xs text-gray-500">Your safe space in care</p>
        </div>

        <AnimatePresence mode="wait">
          {/* \u2500\u2500 Pending Approval \u2500\u2500 */}
          {mode === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Awaiting Approval</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your account has been submitted and is waiting for an administrator to review it.
                You\u2019ll be able to sign in once your account is approved.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  \u2728 This usually happens within 24 hours. If you need access urgently, speak to your care home manager.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => { setMode('choose'); setError(null); }}
                className="w-full text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to sign in
              </Button>
            </motion.div>
          )}

          {/* \u2500\u2500 Signup Success \u2500\u2500 */}
          {signupSuccess && mode === 'signup' && (
            <motion.div
              key="signup-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl border border-green-200 p-5 shadow-sm text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Account Created!</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your registration has been submitted for approval. An administrator will review your request.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-800">
                  \u2728 You\u2019ll receive access once approved. This usually takes up to 24 hours.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => { setMode('choose'); setSignupSuccess(false); }}
                className="w-full text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to sign in
              </Button>
            </motion.div>
          )}

          {/* \u2500\u2500 Choose Mode \u2500\u2500 */}
          {mode === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={() => setMode('young-person')}
                className="w-full p-4 rounded-xl border-2 border-purple-200 bg-white hover:border-purple-400 hover:shadow-md transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">I&apos;m a young person</p>
                  <p className="text-xs text-gray-500">I have my personal code from my key worker</p>
                </div>
              </button>

              <button
                onClick={() => setMode('staff')}
                className="w-full p-4 rounded-xl border-2 border-blue-200 bg-white hover:border-blue-400 hover:shadow-md transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">I&apos;m staff or admin</p>
                  <p className="text-xs text-gray-500">Log in with email, password, or Google</p>
                </div>
              </button>

              <p className="text-center text-xs text-gray-400 pt-2">
                Don&apos;t have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-purple-600 font-semibold hover:underline">
                  Create one
                </button>
              </p>

              <div className="flex items-center justify-center gap-3 pt-3">
                <a href="/privacy" className="text-xs text-gray-400 hover:text-purple-600 transition-colors">Privacy</a>
                <span className="text-gray-300">·</span>
                <a href="/accessibility" className="text-xs text-gray-400 hover:text-purple-600 transition-colors">Accessibility</a>
              </div>
            </motion.div>
          )}

          {/* \u2500\u2500 Young Person \u2014 Invite Code \u2500\u2500 */}
          {mode === 'young-person' && (
            <motion.div
              key="yp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setMode('choose')}
                className="flex items-center gap-1 text-xs text-purple-600 font-bold mb-4 hover:text-purple-800"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>

              <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <KeyRound className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-800">Enter Your Code</h2>
                    <p className="text-xs text-gray-500">Use the 6-letter code from your key worker to sign in</p>
                  </div>
                </div>

                <form onSubmit={handleInviteCode} className="space-y-3">
                  <div>
                    <Label htmlFor="invite-code" className="text-xs font-medium text-gray-600">Invite Code</Label>
                    <Input
                      id="invite-code"
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                      placeholder="e.g. ABC123"
                      className="mt-1 text-center text-lg tracking-[0.3em] font-mono font-bold uppercase"
                      maxLength={6}
                      autoFocus
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || inviteCode.length !== 6}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Checking...</>
                    ) : (
                      <>Let&apos;s Go! <Sparkles className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </form>

                <div className="mt-3 p-2 rounded-lg bg-purple-50 border border-purple-100">
                  <p className="text-xs text-purple-700 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    This is your personal sign-in code. Use it every time you visit
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* \u2500\u2500 Staff / Admin \u2014 Email + Password + Google \u2500\u2500 */}
          {mode === 'staff' && (
            <motion.div
              key="staff"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setMode('choose')}
                className="flex items-center gap-1 text-xs text-blue-600 font-bold mb-4 hover:text-blue-800"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>

              <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-800">Staff Login</h2>
                    <p className="text-xs text-gray-500">Use your email, password, or Google account</p>
                  </div>
                </div>

                {/* Google Sign-In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-3 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 disabled:opacity-50"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Sign in with Google
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form onSubmit={handleStaffLogin} className="space-y-3">
                  <div>
                    <Label htmlFor="email" className="text-xs font-medium text-gray-600">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@okayit.online"
                        className="pl-9 text-sm"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-xs font-medium text-gray-600">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="pl-9 pr-9 text-sm"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-red-700">{error}</p>
                        {error.includes('Google sign-in') && (
                          <button
                            onClick={() => setMode('signup')}
                            className="text-xs text-purple-600 font-semibold hover:underline mt-1 block"
                          >
                            Create an account with email instead →
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing in...</>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">
                    Forgot password? Contact your admin.
                  </p>
                  <button
                    onClick={() => setMode('signup')}
                    className="text-xs text-purple-600 font-semibold hover:underline"
                  >
                    Create account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* \u2500\u2500 Signup Form \u2500\u2500 */}
          {mode === 'signup' && !signupSuccess && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setMode('choose')}
                className="flex items-center gap-1 text-xs text-purple-600 font-bold mb-4 hover:text-purple-800"
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>

              <div className="bg-white rounded-xl border border-purple-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-800">Create Account</h2>
                    <p className="text-xs text-gray-500">For staff &amp; professionals</p>
                  </div>
                </div>

                {redirectedFromLogin ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                    <p className="text-xs text-blue-800">
                      👋 No account found with that email. Fill in the form below to create one. Your account will be reviewed by an admin.
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
                    <p className="text-xs text-amber-800">
                      ⚠️ Your account will need admin approval before you can sign in.
                    </p>
                  </div>
                )}

                {/* Google Quick Register */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-3 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 disabled:opacity-50"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Register with Google
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or with email</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <form onSubmit={handleSignup} className="space-y-2.5">
                  <div>
                    <Label htmlFor="signup-name" className="text-xs font-medium text-gray-600">Full Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Your full name"
                        className="pl-9 text-sm"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-xs font-medium text-gray-600">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="pl-9 text-sm"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-xs font-medium text-gray-600">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="pl-9 pr-9 text-sm"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm" className="text-xs font-medium text-gray-600">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="signup-confirm"
                        type={showPassword ? 'text' : 'password'}
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        placeholder="Repeat password"
                        className="pl-9 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-home" className="text-xs font-medium text-gray-600">Care Home (optional)</Label>
                    <div className="relative mt-1">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        id="signup-home"
                        value={signupCareHome}
                        onChange={(e) => setSignupCareHome(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
                      >
                        <option value="">Select your care home</option>
                        {careHomes.map(h => (
                          <option key={h.id} value={h.id}>{h.displayName}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !signupName || !signupEmail || !signupPassword || !signupConfirm}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating account...</>
                    ) : (
                      'Submit for Approval'
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Already have an account?{' '}
                  <button onClick={() => setMode('staff')} className="text-blue-600 font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}