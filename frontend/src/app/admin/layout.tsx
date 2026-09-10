'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (pathname !== '/admin/login') {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('gharowa_admin_token') : null;
      if (!isAuthenticated && !storedToken) {
        router.replace('/admin/login');
      }
    }
  }, [pathname, isAuthenticated, router]);

  // Allow login page without admin wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Client-side authentication check during render
  const storedToken = isClient && typeof window !== 'undefined' ? localStorage.getItem('gharowa_admin_token') : null;
  if (isClient && !isAuthenticated && !storedToken) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-xs text-slate-400 font-sans">
        লগইন যাচাই করা হচ্ছে...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-slate-900 font-sans antialiased">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminTopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
