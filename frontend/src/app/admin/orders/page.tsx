'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Printer,
  Eye,
  RefreshCw,
  X,
} from 'lucide-react';
import { api } from '../../../lib/api';

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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <ShoppingBag className="w-5 h-5 text-[#900C19]" />
            <span>Order POS & Management (অর্ডার ব্যবস্থাপনা)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            রিয়েল-টাইম অর্ডার স্থিতি পরিবর্তন, ইনভয়েস প্রিন্ট এবং ট্র্যাকিং
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#900C19] hover:border-red-200 flex items-center gap-2 text-xs font-medium shadow-2xs transition-all"
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
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার নম্বর বা ফোন নম্বর..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#900C19] focus:ring-1 focus:ring-[#900C19]"
          />
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'cooking', label: 'Cooking' },
            { id: 'ready', label: 'Ready' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#900C19] text-white font-semibold shadow-2xs'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-normal">
                    কোনো অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#900C19]">
                      {order.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="p-4 font-bengali">
                      <strong className="text-slate-900 font-semibold block">{order.customer.name}</strong>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {order.customer.phone}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-600 font-normal">
                      {order.items.map((i: any) => `${i.nameBn} × ${i.quantity}`).join(', ')}
                    </td>
                    <td className="p-4 font-semibold text-slate-900 font-mono">
                      ৳{order.grandTotal.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                        {order.source}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className={`text-[11px] font-semibold uppercase rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer border ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : order.orderStatus === 'ready'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : order.orderStatus === 'cooking'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-purple-50 text-purple-800 border-purple-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="cooking">Cooking</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#900C19] hover:text-white text-slate-700 text-xs font-medium transition-all inline-flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] flex flex-col print:shadow-none print:m-0 print:p-2 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 print:hidden shrink-0">
              <span className="text-xs font-semibold text-slate-500 font-mono">
                INVOICE #{selectedOrder.orderNumber}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-[#900C19] hover:bg-[#780a15] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-200">
                <h2 className="text-base font-semibold text-slate-900">
                  ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট
                </h2>
                <p className="text-xs text-slate-600 font-mono">Gharowa Restaurant (Since 1972)</p>
                <p className="text-[11px] text-slate-500 font-normal">
                  ৯/সি মতিঝিল বা/এ, ঢাকা-১০০০ • ফোন: ০১৯৭৩২৫৫৮৮৮
                </p>
              </div>

              {/* Order Info */}
              <div className="text-xs space-y-1 text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <strong className="text-slate-900 font-semibold">{selectedOrder.orderNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <strong className="text-slate-900 font-semibold">{selectedOrder.customer.name}</strong>
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
              <div className="border-t border-b border-dashed border-slate-200 py-3 space-y-2 text-xs">
                {selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">{item.nameBn}</span>
                      <span className="text-slate-500 text-[11px] block font-mono">
                        ৳{item.price} × {item.quantity}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-slate-900">৳{item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>৳{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount:</span>
                    <span>-৳{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery:</span>
                  <span>৳{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Grand Total:</span>
                  <span>৳{selectedOrder.grandTotal}</span>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-400 border-t border-dashed border-slate-200">
                <p>ধন্যবাদ! আবার আসবেন।</p>
                <p className="font-mono">Heritage Food in Motijheel Dhaka</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
