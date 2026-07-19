/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Plus, Target, CheckCircle2, DollarSign, Building2, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ICPPage() {
  const [icps, setIcps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIcps();
  }, []);

  const fetchIcps = async () => {
    try {
      const { data } = await api.get('/icps');
      setIcps(data);
    } catch (err) {
      console.error('Failed to fetch ICPs', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (icp: any) => {
    let score = 0;
    if (icp.targetIndustry) score += 25;
    if (icp.companySizeMin) score += 25;
    if (icp.annualRevenueMin) score += 25;
    if (icp.targetRegion) score += 25;
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Ideal Customer Profiles</h2>
          <p className="text-slate-400 text-sm mt-1">Define and target your highest-value prospects.</p>
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create ICP
        </button>
      </div>

      {/* ICP Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : icps.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-3">
          <Target className="w-12 h-12 text-slate-600" />
          <p>No ICPs defined. Create one to improve lead scoring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {icps.map((icp, i) => {
            const score = calculateScore(icp);
            return (
              <motion.div
                key={icp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel p-6 rounded-3xl hover:bg-slate-800/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">
                      <Target className="w-7 h-7 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">{icp.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{icp.description || 'Target Profile'}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border flex flex-col items-center justify-center min-w-[70px] ${getScoreColor(score)}`}>
                    <span className="text-xs font-medium uppercase tracking-wider mb-0.5 opacity-80">Match</span>
                    <span className="text-lg font-bold leading-none">{score}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <Building2 className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Industry & Size</span>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">{icp.targetIndustry || 'Any Industry'}</p>
                    <p className="text-sm text-slate-400">Min. {icp.companySizeMin || 0} employees</p>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Financials</span>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">Min Revenue</p>
                    <p className="text-sm text-emerald-400 font-semibold">{icp.annualRevenueMin ? formatCurrency(icp.annualRevenueMin) : 'Any'}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    {score >= 80 ? (
                      <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-slate-300 font-medium">Highly Effective Profile</span></>
                    ) : (
                      <><AlertCircle className="w-4 h-4 text-yellow-400" /><span className="text-slate-300 font-medium">Requires Optimization</span></>
                    )}
                  </div>
                  <button onClick={() => toast.success('ICP details coming soon.')} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
