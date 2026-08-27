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
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders & POS', icon: ShoppingBag },
    { href: '/admin/kitchen', label: 'Kitchen KDS', icon: ChefHat, badge: 'Live' },
    { href: '/admin/reservations', label: 'Reservations', icon: Calendar },
    { href: '/admin/menu', label: 'Menu Items', icon: Utensils },
    { href: '/admin/inventory', label: 'Inventory Stock', icon: Boxes },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/coupons', label: 'Coupons & Promo', icon: Tag },
    { href: '/admin/reports', label: 'Sales Reports', icon: BarChart3 },
    { href: '/admin/settings', label: 'Restaurant Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-obsidian-400 border-r border-gold-500/15 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-gold-500/15">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-amber-900 p-0.5 shadow-gold">
            <div className="w-full h-full bg-obsidian-500 rounded-[10px] flex items-center justify-center">
              <span className="text-base font-bold text-gold-400 font-serif">GH</span>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">GHAROWA ERP</h2>
            <p className="text-[10px] text-gold-400 font-mono">ESTD 1972 • MOTIJHEEL</p>
          </div>
        </Link>
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
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-gold'
                  : 'text-gray-300 hover:bg-obsidian-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-obsidian-950' : 'text-gold-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    isActive
                      ? 'bg-obsidian-950 text-gold-400'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Actions */}
      <div className="p-4 border-t border-gold-500/15 space-y-3 bg-obsidian-500/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-xs font-bold text-gold-400">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white truncate max-w-[110px]">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-gray-400 capitalize">{user?.role || 'Admin'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-obsidian-300 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-obsidian-300 hover:bg-obsidian-200 text-gold-300 text-[11px] font-semibold transition-colors"
        >
          <span>ওয়েবসাইট দেখুন</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
