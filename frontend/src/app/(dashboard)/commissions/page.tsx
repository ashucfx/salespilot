/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, TrendingUp, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

import { RoleGuard } from '@/components/common/RoleGuard';
import { TableSkeleton } from '@/components/common/SkeletonLoader';

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const { data } = await api.get('/commissions');
      setCommissions(data);
    } catch (err) {
      console.error('Failed to fetch commissions', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    let pending = 0;
    let paid = 0;
    
    commissions.forEach(c => {
      if (c.status === 'PAID') {
        paid += c.amount || 0;
      } else {
        pending += c.amount || 0;
      }
    });

    return { pending, paid, total: pending + paid };
  };

  const stats = calculateStats();

  const getStatusColor = (status: string) => {
    if (!status) return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    switch (status.toUpperCase()) {
      case 'PAID': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'REJECTED': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-400" />
            Commissions
          </h2>
          <p className="text-slate-400 text-sm mt-1">Track and manage your earned incentives.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all border border-slate-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider relative z-10">Total YTD Earnings</p>
          <h3 className="text-4xl font-bold text-white relative z-10">
            {loading ? '...' : formatCurrency(stats.total)}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 w-max px-3 py-1 rounded-full relative z-10">
            <TrendingUp className="w-4 h-4" />
            12% vs last year
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
          <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider relative z-10">Pending Payout</p>
          <h3 className="text-4xl font-bold text-white relative z-10">
            {loading ? '...' : formatCurrency(stats.pending)}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400 relative z-10">
            <AlertCircle className="w-4 h-4" />
            To be paid next cycle
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider relative z-10">Paid Out</p>
          <h3 className="text-4xl font-bold text-emerald-400 relative z-10">
            {loading ? '...' : formatCurrency(stats.paid)}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400/70 relative z-10">
            <CheckCircle2 className="w-4 h-4" />
            Successfully processed
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search commissions by deal name..."
            className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="px-4 py-2 bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-300 border border-indigo-500/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-3xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-indigo-500/10 bg-slate-900/30">
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Associated Deal</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Deal Value</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Commission</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rule Applied</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">Loading commissions...</td>
                </tr>
              ) : commissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No commission records found.</td>
                </tr>
              ) : (
                commissions.map((comm, i) => (
                  <motion.tr 
                    key={comm.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                        {comm.deal?.name || 'Unknown Deal'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Closed: {comm.deal?.expectedCloseDate ? new Date(comm.deal.expectedCloseDate).toLocaleDateString() : 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-300">
                        {formatCurrency(comm.deal?.dealValue || 0)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-white bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700/50">
                        {formatCurrency(comm.amount || 0)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-medium text-slate-400 border border-slate-700/50 px-2.5 py-1 rounded-lg bg-slate-800/30">
                        {comm.rule?.ruleType || 'STANDARD TIER'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(comm.status)}`}>
                        {comm.status || 'PENDING'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
