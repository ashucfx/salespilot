/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, DollarSign, ArrowUpRight, Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pipeline: 0, won: 0 });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data } = await api.get('/deals');
      setDeals(data);
      
      // Calculate basic stats for the KPI cards
      const pipeline = data.reduce((acc: number, deal: any) => acc + (deal.dealValue || 0), 0);
      const won = data
        .filter((d: any) => d.status === 'WON')
        .reduce((acc: number, deal: any) => acc + (deal.dealValue || 0), 0);
        
      setStats({ pipeline, won });
    } catch (err) {
      console.error('Failed to fetch deals', err);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    if (!stage) return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    switch (stage.toUpperCase()) {
      case 'WON': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'LOST': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'NEGOTIATION': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'PROPOSAL_SENT': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Deals</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and forecast your revenue pipeline.</p>
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Deal
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Total Pipeline</p>
            <h3 className="text-2xl font-bold text-white">
              {loading ? '...' : formatCurrency(stats.pipeline)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Briefcase className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Closed Won</p>
            <h3 className="text-2xl font-bold text-emerald-400">
              {loading ? '...' : formatCurrency(stats.won)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Win Rate</p>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {loading ? '...' : (deals.length > 0 ? Math.round((deals.filter(d => d.status === 'WON').length / deals.length) * 100) + '%' : '0%')}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <ArrowUpRight className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search deals by name or company..."
            className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="px-4 py-2 bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-300 border border-indigo-500/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Deals Table */}
      <div className="glass-panel rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-indigo-500/10 bg-slate-900/30">
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Deal Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Expected Close</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">Loading deals...</td>
                </tr>
              ) : deals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No deals found.</td>
                </tr>
              ) : (
                deals.map((deal, i) => (
                  <motion.tr 
                    key={deal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{deal.name || 'Unnamed Deal'}</p>
                        <p className="text-xs text-slate-500 mt-1">{deal.lead?.company?.name || 'No Company'} • {deal.owner?.firstName || 'Unassigned'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-white bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700/50">
                        {formatCurrency(deal.dealValue || 0)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStageColor(deal.status)}`}>
                        {deal.status || 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), 'MMM d, yyyy') : 'TBD'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={(e) => { e.stopPropagation(); toast.success('Deal details coming soon.') }} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-5 h-5" />
                      </button>
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
