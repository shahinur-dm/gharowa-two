'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
  X,
  Phone,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { formatPrice, toBanglaNumber } from '../../../lib/bangla';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/orders', {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (e) {
      console.warn('Orders fetch error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      const res: any = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by Admin POS`,
      });

      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (e: any) {
      alert(e.message || 'Status update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-400" />
            <span>Order POS & Management (অর্ডার ব্যবস্থাপনা)</span>
          </h1>
          <p className="text-xs text-gray-400">
            রিয়েল-টাইম অর্ডার স্থিতি পরিবর্তন, ভাউচার প্রিন্ট এবং ট্র্যাকিং
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-obsidian-400 border border-gold-500/20 text-gold-300 hover:text-white flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrders();
          }}
          className="relative w-full sm:w-80"
        >
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার নম্বর বা ফোন নম্বর লিখে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-400 border border-gold-500/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
          />
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'cooking', label: 'Cooking' },
            { id: 'ready', label: 'Ready' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-gold-500 text-obsidian-950 font-bold'
                  : 'bg-obsidian-400 text-gray-300 hover:text-white border border-gold-500/15'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-obsidian-400 border border-gold-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-obsidian-300/80 text-gray-400 uppercase tracking-wider font-semibold border-b border-gold-500/10">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    কোনো অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-obsidian-300/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-gold-400">
                      {order.orderNumber}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="p-4 font-bengali">
                      <strong className="text-white block">{order.customer.name}</strong>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {order.customer.phone}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate">
                      {order.items.map((i: any) => `${i.nameBn} × ${i.quantity}`).join(', ')}
                    </td>
                    <td className="p-4 font-bold text-white font-mono">
                      ৳{order.grandTotal.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-obsidian-300 border border-gold-500/20 text-gold-400">
                        {order.source}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : order.orderStatus === 'ready'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : order.orderStatus === 'cooking'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}
                      >
                        <option value="pending" className="bg-obsidian-500 text-white">Pending</option>
                        <option value="cooking" className="bg-obsidian-500 text-white">Cooking</option>
                        <option value="ready" className="bg-obsidian-500 text-white">Ready</option>
                        <option value="delivered" className="bg-obsidian-500 text-white">Delivered</option>
                        <option value="cancelled" className="bg-obsidian-500 text-white">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-obsidian-300 hover:bg-gold-500 hover:text-obsidian-950 text-gray-300 text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>রসিদ</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt / Voucher Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md bg-white text-gray-900 rounded-3xl p-6 shadow-2xl space-y-4 print:shadow-none print:m-0 print:p-2">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <span className="text-xs font-bold text-gray-500 font-mono">
                INVOICE #{selectedOrder.orderNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-300">
              <h2 className="text-base font-bold tracking-tight">
                ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট
              </h2>
              <p className="text-xs text-gray-600 font-mono">Gharowa Restaurant (Since 1972)</p>
              <p className="text-[11px] text-gray-500">
                ৯/সি মতিঝিল বা/এ, ঢাকা-১০০০ • ফোন: ০১৯৭৩২৫৫৮৮৮
              </p>
            </div>

            {/* Order Info */}
            <div className="text-xs space-y-1 text-gray-600 font-mono">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <strong className="text-gray-900">{selectedOrder.orderNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <strong className="text-gray-900">{selectedOrder.customer.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{selectedOrder.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="text-right truncate max-w-[200px]">
                  {selectedOrder.customer.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border-t border-b border-dashed border-gray-300 py-3 space-y-2 text-xs">
              {selectedOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-900">{item.nameBn}</span>
                    <span className="text-gray-500 text-[11px] block">
                      ৳{item.price} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-gray-900">৳{item.subtotal}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>৳{selectedOrder.subtotal}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>-৳{selectedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery:</span>
                <span>৳{selectedOrder.deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t">
                <span>Grand Total:</span>
                <span>৳{selectedOrder.grandTotal}</span>
              </div>
            </div>

            <div className="text-center pt-2 text-[10px] text-gray-500 border-t border-dashed border-gray-300">
              <p>ধন্যবাদ! আবার আসবেন।</p>
              <p className="font-mono">Heritage Food in Motijheel Dhaka</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
