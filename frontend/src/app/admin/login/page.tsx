'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('admin@gharowa.com');
  const [password, setPassword] = useState('Admin@Gharowa1972');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setIsLoading(true);
      const res: any = await api.post('/auth/login', { email, password });

      if (res.success && res.token && res.user) {
        setAuth(res.user, res.token);
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-obsidian-400 border border-gold-500/25 rounded-3xl p-8 shadow-gold-lg text-white space-y-6">
        {/* Brand Mark */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-900 p-0.5 shadow-gold mx-auto">
            <div className="w-full h-full bg-obsidian-500 rounded-[14px] flex items-center justify-center">
              <span className="text-xl font-bold text-gold-400 font-serif">GH</span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-white font-bengali">
            ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট
          </h1>
          <p className="text-xs text-gold-400 font-mono">ERP, POS & KITCHEN PORTAL</p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              ইমেইল এড্রেস / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gharowa.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              পাসওয়ার্ড / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-obsidian-300 border border-gold-500/20 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-300/80 border border-white/5 text-[11px] text-gray-400 space-y-0.5">
            <p>
              <strong className="text-gold-400">ডিফল্ট অ্যাডমিন:</strong> admin@gharowa.com
            </p>
            <p>
              <strong className="text-gold-400">পাসওয়ার্ড:</strong> Admin@Gharowa1972
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-gold transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>লগইন করুন / Access ERP</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
