'use client';

import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, Flame, RefreshCw } from 'lucide-react';
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
    <div className="space-y-6 max-w-full pb-12 font-sans">
      {/* KDS Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 text-[#900C19] border border-red-200">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
              <span>Kitchen Display System (KDS) — লাইভ কিচেন স্ক্রিন</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                Touch Friendly
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              রিয়েল-টাইম কিচেন টিকিট বোর্ড • পেন্ডিং থেকে কুকিং এবং রেডি স্ট্যাটাস
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              socketConnected
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>{socketConnected ? 'Socket Live' : 'Connecting...'}</span>
          </span>

          <button
            onClick={fetchKitchenOrders}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
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
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                PENDING (অপেক্ষমাণ)
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-mono font-semibold text-xs flex items-center justify-center">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {pendingOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-3xl bg-white border border-amber-300 shadow-sm space-y-4 hover:border-amber-400 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-base font-semibold text-amber-900 font-mono block">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-700 font-bengali font-normal block mt-0.5">
                      গ্রাহক: {order.customer.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
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
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="font-semibold text-slate-900 font-bengali">
                        {item.nameBn}
                      </span>
                      <span className="font-mono font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {order.specialInstructions && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-bengali">
                    <strong>বিশেষ নোট:</strong> {order.specialInstructions}
                  </div>
                )}

                {/* Action CTA */}
                <button
                  onClick={() => handleUpdateStatus(order._id, 'cooking')}
                  className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
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
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-blue-700" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-900">
                COOKING (রান্না হচ্ছে)
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-semibold text-xs flex items-center justify-center">
              {cookingOrders.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {cookingOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-3xl bg-white border border-blue-300 shadow-sm space-y-4 hover:border-blue-400 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-base font-semibold text-blue-900 font-mono block">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-700 font-bengali font-normal block mt-0.5">
                      গ্রাহক: {order.customer.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
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
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="font-semibold text-slate-900 font-bengali">
                        {item.nameBn}
                      </span>
                      <span className="font-mono font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => handleUpdateStatus(order._id, 'ready')}
                  className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
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
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-900">
                READY (ডেলিভারির জন্য প্রস্তুত)
              </h2>
            </div>
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono font-semibold text-xs flex items-center justify-center">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {readyOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-3xl bg-white border border-emerald-300 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-base font-semibold text-emerald-900 font-mono block">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-700 font-bengali font-normal block mt-0.5">
                      {order.customer.name} ({order.customer.phone})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
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
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="font-semibold text-slate-900 font-bengali">
                        {item.nameBn}
                      </span>
                      <span className="font-mono font-semibold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => handleUpdateStatus(order._id, 'delivered')}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
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
