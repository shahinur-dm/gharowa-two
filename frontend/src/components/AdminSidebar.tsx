'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  ChefHat,
  Calendar,
  Utensils,
  Boxes,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import GharowaLogo from './GharowaLogo';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders & POS', icon: ShoppingBag },
    { href: '/admin/kitchen', label: 'Kitchen KDS', icon: ChefHat, badge: 'Live' },
    { href: '/admin/reservations', label: 'Reservations', icon: Calendar },
    { href: '/admin/menu', label: 'Menu & Products', icon: Utensils },
    { href: '/admin/categories', label: 'Categories (ক্যাটাগরি)', icon: Boxes },
    { href: '/admin/inventory', label: 'Inventory Stock', icon: Boxes },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/coupons', label: 'Coupons & Promo', icon: Tag },
    { href: '/admin/reports', label: 'Sales Reports', icon: BarChart3 },
    { href: '/admin/media', label: 'Media Library', icon: BarChart3 },
    { href: '/admin/settings', label: 'Website CMS & Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 font-sans transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <GharowaLogo size={36} variant="emblem" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight">GHAROWA ERP</h2>
              <p className="text-[10px] text-[#900C19] font-medium tracking-wider">ESTD 1972 • MOTIJHEEL</p>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#900C19] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Quick Actions */}
        <div className="p-4 border-t border-slate-200 space-y-2.5 bg-slate-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 text-[#900C19] flex items-center justify-center text-xs font-semibold shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Admin'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#900C19] hover:border-red-200 text-[11px] font-medium transition-colors shadow-2xs"
          >
            <span>লাইভ ওয়েবসাইট দেখুন</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>
    </>
  );
}
