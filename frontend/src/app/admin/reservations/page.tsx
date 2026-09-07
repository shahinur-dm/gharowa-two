'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';
import { Reservation } from '../../../types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/reservations', {
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (res.success && res.data) {
        setReservations(res.data);
      }
    } catch (e) {
      console.warn('Reservations fetch error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: status as any } : r))
      );
    } catch (e: any) {
      alert(e.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই রিজার্ভেশনটি মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2 tracking-tight">
            <Calendar className="w-5 h-5 text-[#900C19]" />
            <span>Table Reservations (টেবিল বুকিং ব্যবস্থাপনা)</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            গ্রাহকের টেবিল বুকিং রিকোয়েস্ট পর্যালোচনা ও কনফার্মেশন
          </p>
        </div>

        <button
          onClick={fetchReservations}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#900C19] hover:border-red-200 flex items-center gap-2 text-xs font-medium shadow-2xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-[#900C19] text-white font-semibold shadow-2xs'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="p-4">Reservation ID</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Preference</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-normal">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-normal">
                    কোনো রিজার্ভেশন পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#900C19]">
                      {r.reservationNumber}
                    </td>
                    <td className="p-4 font-bengali font-semibold text-slate-900">{r.name}</td>
                    <td className="p-4 font-mono text-slate-600">{r.phone}</td>
                    <td className="p-4 font-mono font-semibold text-slate-900">
                      {r.guestCount} জন
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      <div>{r.date}</div>
                      <div className="text-[11px] text-slate-500">{r.timeSlot}</div>
                    </td>
                    <td className="p-4 capitalize text-slate-600">
                      {r.seatingPreference?.replace('_', ' ') || 'Main Hall'}
                    </td>
                    <td className="p-4">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateStatus(r._id, e.target.value)}
                        className={`text-[11px] font-medium capitalize rounded-lg px-2 py-1 focus:outline-none cursor-pointer border ${
                          r.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : r.status === 'completed'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : r.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
