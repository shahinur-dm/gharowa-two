'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Allow login page without sidebar/topbar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Client-side authentication guard
  if (isClient && !isAuthenticated && !localStorage.getItem('gharowa_admin_token')) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-obsidian-500 flex text-gray-100 antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminTopBar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
