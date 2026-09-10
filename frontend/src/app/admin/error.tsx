'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Panel Navigation/Render Exception:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-2xs">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-base font-semibold text-slate-800 mb-1">
        পেজ লোড করতে সাময়িক সমস্যা হয়েছে
      </h2>
      <p className="text-xs text-slate-500 max-w-md mb-5 leading-relaxed">
        {error?.message || 'পৃষ্ঠাটি পুনরায় লোড করতে নিচের বাটনে ক্লিক করুন।'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white text-xs font-semibold shadow-2xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>পুনরায় চেষ্টা করুন (Retry)</span>
        </button>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.location.reload();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all"
        >
          <span>ব্রাউজার রিফ্রেশ</span>
        </button>
      </div>
    </div>
  );
}
