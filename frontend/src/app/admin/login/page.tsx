'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../lib/api';
import GharowaLogo from '../../../components/GharowaLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('ইমেইল এবং পাসওয়ার্ড প্রদান করুন / Please enter email & password');
      return;
    }

    try {
      setIsLoading(true);
      const res: any = await api.post('/auth/login', { email: email.trim(), password });

      if (res.success && res.token && res.user) {
        setAuth(res.user, res.token);
        router.push('/admin/dashboard');
        return;
      } else {
        setErrorMsg(res.message || 'লগইন ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      // Fallback for super admin credentials if backend is offline or on standalone Vercel preview
      if (
        email.trim().toLowerCase() === 'admin@gharowa.com' &&
        password === 'Admin@Gharowa1972'
      ) {
        const fallbackUser = {
          id: 'admin-1972',
          name: 'Gharowa Head Admin',
          email: 'admin@gharowa.com',
          role: 'super_admin' as const,
        };
        const fallbackToken = 'gharowa_admin_token_1972_valid';
        setAuth(fallbackUser, fallbackToken);
        router.push('/admin/dashboard');
        return;
      }
      setErrorMsg(err.message || 'ইমেইল বা পাসওয়ার্ড সঠিক নয় / Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Back to website shortcut */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center text-xs text-slate-500">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-[#900C19] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ওয়েবসাইটে ফিরে যান / Main Website</span>
        </Link>
        <span className="font-mono text-[11px] text-slate-400">ESTD 1972</span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <GharowaLogo size={56} variant="emblem" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight font-sans">
              ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট
            </h1>
            <p className="text-[11px] sm:text-xs text-[#900C19] font-semibold tracking-wider uppercase mt-1">
              Admin & Enterprise Management Portal
            </p>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              ERP • POS • Kitchen KDS • CMS Control
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium leading-relaxed animate-in fade-in duration-200">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 font-sans">
              অ্যাডমিন ইমেইল / Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gharowa.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19] focus:ring-2 focus:ring-[#900C19]/15 font-normal transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-700 font-sans">
                পাসওয়ার্ড / Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19] focus:ring-2 focus:ring-[#900C19]/15 font-normal transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>লগইন করুন / Access Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-normal">
            Authorized staff and system administration access only.
          </p>
        </div>
      </div>
    </div>
  );
}
