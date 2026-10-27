import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import {
  ArrowRight,
  Compass,
  Lock,
  Mail,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface LoginScreenProps {
  onGuestAccess?: () => void;
}

// Floating DSA background elements for elite aesthetic
const floatingElements = [
  { text: 'O(log n)', top: '15%', left: '10%', delay: '0s', duration: '8s' },
  { text: 'Binary Search', top: '75%', left: '15%', delay: '2s', duration: '10s' },
  { text: 'Graph Traversal', top: '20%', right: '12%', delay: '1s', duration: '9s' },
  { text: 'O(n log n)', bottom: '18%', right: '15%', delay: '3s', duration: '11s' },
  { text: 'Dynamic Programming', top: '45%', left: '5%', delay: '1.5s', duration: '12s' },
  { text: 'Two Pointers', top: '50%', right: '8%', delay: '2.5s', duration: '9.5s' },
  { text: 'Heap / Priority Queue', bottom: '10%', left: '40%', delay: '4s', duration: '10.5s' },
];

export function LoginScreen({ onGuestAccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0C0C0E] text-white overflow-hidden selection:bg-violet-500 selection:text-white">

      {/* --- Ambient Gradients & Grid Background --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f22_1px,transparent_1px),linear-gradient(to_bottom,#1f1f22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000" />

      {/* --- Floating DSA Code / Complexity Particles --- */}
      {floatingElements.map((el, i) => (
        <div
          key={i}
          className="absolute hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-gray-400 select-none pointer-events-none shadow-2xl animate-float"
          style={{
            top: el.top,
            left: el.left,
            right: el.right,
            bottom: el.bottom,
            animationDelay: el.delay,
            animationDuration: el.duration,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
          {el.text}
        </div>
      ))}

      {/* --- Main Glassmorphic Card --- */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-[#141417]/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300">

          {/* Header */}
          <div className="pt-10 pb-6 px-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-xl mb-4 shadow-xl shadow-violet-600/30 group">
              <Compass className="w-7 h-7 animate-spin-slow" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              DSA Roadmap Vault
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Master 600 curated problems & sync progress.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 pb-8 space-y-5">

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-[#1c1c21] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-[#141417] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-[#1c1c21] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-[#141417] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Primary Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-[11px] text-gray-500 uppercase tracking-widest font-semibold">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Guest Button */}
            {onGuestAccess && (
              <button
                type="button"
                onClick={onGuestAccess}
                className="w-full flex items-center justify-between group bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-gray-300 hover:text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:border-white/20 active:scale-[0.98]"
              >
                <span className="flex items-center gap-2.5 text-sm">
                  <Sparkles className="w-4 h-4 text-violet-400 group-hover:rotate-12 transition-transform" />
                  Continue without logging in
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            )}
          </form>

          {/* Footer Note */}
          <div className="bg-[#101013] px-8 py-4 border-t border-white/5 text-center">
            <p className="text-xs text-gray-400">
              Guest mode saves progress locally in your browser. <br/>
              <span className="text-violet-400 font-medium">Sign in</span> to enable secure cloud sync.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-xs text-gray-500 font-medium">
          © 2026 DSA Roadmap Vault · Built for Engineers
        </p>
      </div>
    </div>
  );
}
