import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { ArrowRight, Compass, Lock, Mail, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onGuestAccess?: () => void;
}

export function LoginScreen({ onGuestAccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setEmail('');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#141414] text-white p-4 overflow-hidden">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />

      {/* Login Card */}
      <div className="relative w-full max-w-md space-y-8 bg-[#1f1f1f]/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl border border-white/10 shadow-2xl shadow-black/50 transition-all duration-300">

        {/* Header & Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 mb-1">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-300 to-white bg-clip-text text-transparent">
            DSA Roadmap Vault
          </h1>
          <p className="text-sm text-gray-400">
            Master 600 curated problems. Sync progress across devices.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#141414]/60 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:border-violet-500 focus:bg-[#141414] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#141414]/60 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:border-violet-500 focus:bg-[#141414] focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-500 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Guest Mode Button */}
        {onGuestAccess && (
          <button
            type="button"
            onClick={onGuestAccess}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all duration-200 group"
          >
            <Sparkles size={16} className="text-violet-400 group-hover:rotate-12 transition-transform" />
            <span>Continue without logging in</span>
            <ArrowRight size={15} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        <p className="text-[11px] text-center text-gray-500">
          Guest mode stores your roadmap progress locally in your browser.
        </p>
      </div>
    </div>
  );
}
