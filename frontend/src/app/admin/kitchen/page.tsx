'use client';

import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, Flame, Bell, Volume2, RefreshCw, Sparkles } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { api } from '../../../lib/api';

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);

  const fetchKitchenOrders = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/orders/kitchen');
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (e) {
      console.warn('Kitchen fetch error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();

    // Setup Socket.IO realtime connection
    const socket: Socket = io('http://localhost:5000', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join:kitchen');
    });

    socket.on('order:created', (newOrder: any) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

    socket.on('order:statusChanged', ({ orderId, status }: any) => {
      if (status === 'delivered' || status === 'cancelled') {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
        );
      }
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `Moved to ${newStatus} on Kitchen Screen`,
      });

      if (newStatus === 'delivered') {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (e: any) {
      alert(e.message || 'Status transition failed');
    }
  };

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending');
  const cookingOrders = orders.filter((o) => o.orderStatus === 'cooking');
  const readyOrders = orders.filter((o) => o.orderStatus === 'ready');

  return (
    <div className="space-y-6 max-w-full pb-12">
      {/* KDS Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-obsidian-400 border border-gold-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Kitchen Display System (KDS) — লাইভ কিচেন স্ক্রিন</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-gold-500/20 text-gold-400 border border-gold-500/30">
                Touch Friendly
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              রিয়েল-টাইম কিচেন টিকিট বোর্ড • পেন্ডিং থেকে কুকিং এবং রেডি স্ট্যাটাস
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              socketConnected
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span>{socketConnected ? 'Socket Live' : 'Connecting...'}</span>
          </span>

          <button
            onClick={fetchKitchenOrders}
            className="p-2 rounded-xl bg-obsidian-300 hover:bg-obsidian-200 text-gray-300 hover:text-white"
            title="Refresh Tickets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3 Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: PENDING */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                PENDING (অপেক্ষমাণ)
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-amber-500 text-obsidian-950 font-mono font-bold text-xs flex items-center justify-center">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {pendingOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-3xl bg-obsidian-400 border border-amber-500/30 shadow-lg space-y-4 hover:border-amber-500/60 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-base font-extrabold text-gold-400 font-mono block">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-300 font-bengali block mt-0.5">
                      গ্রাহক: {order.customer.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs">
                  {order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-obsidian-300/80"
                    >
                      <span className="font-bold text-white font-bengali">
                        {item.nameBn}
                      </span>
                      <span className="font-mono font-bold text-gold-400 bg-obsidian-200 px-2 py-0.5 rounded">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {order.specialInstructions && (
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-bengali">
                    <strong>বিশেষ নোট:</strong> {order.specialInstructions}
                  </div>
                )}

                {/* Action CTA */}
                <button
                  onClick={() => handleUpdateStatus(order._id, 'cooking')}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Flame className="w-4 h-4" />
                  <span>রান্না শুরু করুন (Start Cooking) →</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: COOKING */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                COOKING (রান্না হচ্ছে)
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center">
              {cookingOrders.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {cookingOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-3xl bg-obsidian-400 border border-blue-500/30 shadow-lg space-y-4 hover:border-blue-500/60 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-base font-extrabold text-blue-400 font-mono block">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-300 font-bengali block mt-0.5">
                      গ্রাহক: {order.customer.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs">
                  {order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-obsidian-300/80"
                    >
                      <span className="font-bold text-white font-bengali">
                        {item.nameBn}
                      </span>
                      <span className="font-mono font-bold text-blue-400 bg-obsidian-200 px-2 py-0.5 rounded">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => handleUpdateStatus(order._id, 'ready')}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>প্রস্তুত হয়েছে (Mark as Ready) ✓</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: READY */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                READY (ডেলিভারির জন্য প্রস্তুত)
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-obsidian-950 font-mono font-bold text-xs flex items-center justify-center">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {readyOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-3xl bg-obsidian-400 border border-emerald-500/30 shadow-lg space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-base font-extrabold text-emerald-400 font-mono block">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-300 font-bengali block mt-0.5">
                      {order.customer.name} ({order.customer.phone})
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs">
                  {order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-obsidian-300/80"
                    >
                      <span className="font-bold text-white font-bengali">
                        {item.nameBn}
                      </span>
                      <span className="font-mono font-bold text-emerald-400 bg-obsidian-200 px-2 py-0.5 rounded">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => handleUpdateStatus(order._id, 'delivered')}
                  className="w-full py-3 rounded-2xl bg-obsidian-300 hover:bg-obsidian-200 text-gray-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>ডেলিভারি সম্পন্ন (Archive)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
