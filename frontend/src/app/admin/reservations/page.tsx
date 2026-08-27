'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle2, XCircle, Trash2, RefreshCw, Search } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-400" />
            <span>Table Reservations (টেবিল বুকিং ব্যবস্থাপনা)</span>
          </h1>
          <p className="text-xs text-gray-400">
            গ্রাহকের টেবিল বুকিং রিকোয়েস্ট পর্যালোচনা ও কনফার্মেশন
          </p>
        </div>

        <button
          onClick={fetchReservations}
          className="p-2.5 rounded-xl bg-obsidian-400 border border-gold-500/20 text-gold-300 hover:text-white flex items-center gap-2 text-xs font-semibold"
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-gold-500 text-obsidian-950 font-bold'
                : 'bg-obsidian-400 text-gray-300 hover:text-white border border-gold-500/15'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-obsidian-400 border border-gold-500/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-obsidian-300/80 text-gray-400 uppercase tracking-wider font-semibold border-b border-gold-500/10">
              <tr>
                <th className="p-4">Reservation ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Seating Zone</th>
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
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    কোনো রিজার্ভেশন পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res._id} className="hover:bg-obsidian-300/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-gold-400">
                      {res.reservationNumber}
                    </td>
                    <td className="p-4">
                      <strong className="text-white block font-bengali">{res.name}</strong>
                      <span className="text-[11px] text-gray-400 font-mono">{res.phone}</span>
                    </td>
                    <td className="p-4 font-mono text-xs">
                      <span className="text-white block">{res.date}</span>
                      <span className="text-gold-400">{res.timeSlot}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {res.guestCount} Persons
                    </td>
                    <td className="p-4 font-mono text-[11px] capitalize text-gray-300">
                      {res.seatingPreference.replace('_', ' ')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : res.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : res.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'confirmed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                          >
                            Confirm
                          </button>
                        )}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(res._id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(res._id)}
                          className="p-1.5 rounded-lg bg-obsidian-300 text-gray-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
