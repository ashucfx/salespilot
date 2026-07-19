/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Target, Calendar, Filter, Users, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function TargetsPage() {
  const [targets, setTargets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const { data } = await api.get('/targets');
      setTargets(data);
    } catch (err) {
      console.error('Failed to fetch targets', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-400" />
            Targets & Quotas
          </h2>
          <p className="text-slate-400 text-sm mt-1">Track sales performance against goals.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors">
            <option>Q3 2026</option>
            <option>Q4 2026</option>
            <option>FY 2026</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column - User's Target */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Main Progress Card */}
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-lg font-bold text-white">Your Q3 Target</h3>
                  <p className="text-slate-400 text-sm mt-1">32 days remaining in quarter</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-white">{formatCurrency(750000)}</p>
                  <p className="text-slate-400 text-sm mt-1">Goal: {formatCurrency(1000000)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-indigo-400">75% Achieved</span>
                  <span className="text-slate-400">{formatCurrency(250000)} to go</span>
                </div>
                <div className="h-4 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Targets List */}
          <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Team Performance
              </h3>
              <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="text-slate-400 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2">
              {loading ? (
                <div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : targets.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No targets found.</p>
              ) : (
                targets.map((target, i) => {
                  const targetAmount = target.targetAmount || 1; // avoid div by 0
                  const achievedAmount = target.achievedAmount || 0;
                  const progress = Math.min(100, Math.round((achievedAmount / targetAmount) * 100));
                  const isOverachieved = achievedAmount >= targetAmount;

                  return (
                    <motion.div 
                      key={target.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl group hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-white">
                            {target.employee?.user?.firstName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                              {target.employee?.user?.firstName} {target.employee?.user?.lastName}
                            </h4>
                            <p className="text-xs text-slate-500">{target.period || 'Q3 2026'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{formatCurrency(achievedAmount)}</p>
                          <p className="text-xs text-slate-500">of {formatCurrency(targetAmount)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isOverachieved ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-9 text-right ${isOverachieved ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {progress}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Leaderboard */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Top Performers
          </h3>

          <div className="space-y-4 flex-1">
            {[1, 2, 3].map((rank) => (
              <div key={rank} className="relative flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                {rank === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />}
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                  ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                    rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/30' : 
                    'bg-orange-700/20 text-orange-500 border border-orange-700/30'}`}
                >
                  #{rank}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">Sales Rep {rank}</h4>
                  <p className="text-xs text-slate-400 truncate">12 deals closed</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-emerald-400">{formatCurrency(800000 - (rank * 50000))}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => toast.success('Full leaderboard coming soon.')} className="w-full py-3 mt-4 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1">
            View Full Leaderboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
