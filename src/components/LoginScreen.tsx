import React, { useState, useEffect, useRef } from 'react';
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

export function LoginScreen({ onGuestAccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Interactive Canvas Animation (Graph / Binary Tree Nodes) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Node & Edge Configuration
    const nodeCount = 25;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      label: string;
    }> = [];

    const labels = ['O(1)', 'O(n)', 'O(log n)', 'BST', 'DFS', 'BFS', 'DP', 'Heap', 'Graph', 'Array'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 3 + 2,
        label: labels[Math.floor(Math.random() * labels.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw connections / edges
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            // Opacity based on distance
            const alpha = (1 - dist / 160) * 0.15;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw Node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.5)';
        ctx.fill();

        // Draw subtle text label for specific nodes
        if (i % 3 === 0) {
          ctx.font = '10px JetBrains Mono, monospace';
          ctx.fillStyle = 'rgba(156, 163, 175, 0.35)';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#09090B] text-white overflow-hidden selection:bg-violet-500 selection:text-white">

      {/* --- Live Interactive Canvas Background Animation --- */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Ambient Backlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-violet-600/15 via-fuchsia-600/10 to-transparent rounded-full blur-[130px] pointer-events-none z-0 animate-pulse duration-1000" />

      {/* --- Main Ultra-Clean Glassmorphic Card --- */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-[#121216]/85 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300">

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
                  className="block w-full pl-10 pr-3 py-3 bg-[#18181C] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-[#121216] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
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
                  className="block w-full pl-10 pr-3 py-3 bg-[#18181C] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-[#121216] focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
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
          <div className="bg-[#0D0D10] px-8 py-4 border-t border-white/5 text-center">
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
