'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  Trophy, Award, Zap, Star, Crown, Flame, Shield, CheckCircle2, 
  Sparkles, TrendingUp, Users, DollarSign, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncentivesPage() {
  const [loading, setLoading] = useState(true);
  const [incentives, setIncentives] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    fetchIncentiveData();
  }, []);

  const fetchIncentiveData = async () => {
    try {
      setLoading(true);
      const [incRes, leadRes] = await Promise.all([
        api.get('/incentives/me'),
        api.get('/incentives/leaderboard')
      ]);

      setIncentives(incRes.data.data || []);
      setLeaderboard(leadRes.data.data || []);
    } catch (err) {
      console.error('Failed to load incentive data', err);
      toast.error('Failed to load incentive challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (incentiveId: string) => {
    try {
      setClaimingId(incentiveId);
      await api.post(`/incentives/claim/${incentiveId}`);
      toast.success('🎉 Incentive reward claimed successfully!');
      fetchIncentiveData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to claim incentive reward');
    } finally {
      setClaimingId(null);
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'trophy': return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'zap': return <Zap className="w-6 h-6 text-indigo-400" />;
      case 'star': return <Star className="w-6 h-6 text-yellow-400" />;
      case 'crown': return <Crown className="w-6 h-6 text-amber-300" />;
      case 'flame': return <Flame className="w-6 h-6 text-rose-400" />;
      case 'gem': return <Sparkles className="w-6 h-6 text-cyan-400" />;
      default: return <Award className="w-6 h-6 text-violet-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> #1 Champion</span>;
    if (rank === 2) return <span className="px-2.5 py-1 rounded-full bg-slate-300/20 text-slate-200 border border-slate-400/30 text-xs font-bold flex items-center gap-1"><Award className="w-3.5 h-3.5" /> #2 Platinum</span>;
    if (rank === 3) return <span className="px-2.5 py-1 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/30 text-xs font-bold flex items-center gap-1"><Award className="w-3.5 h-3.5" /> #3 Gold</span>;
    return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium">#{rank}</span>;
  };

  const totalRewardsClaimed = incentives
    .filter(i => i.status === 'CLAIMED')
    .reduce((acc, curr) => acc + (curr.incentive?.rewardAmount || 0), 0);

  const claimableCount = incentives.filter(i => i.status === 'CLAIMABLE').length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-violet-900/40 to-slate-900 border border-indigo-500/20 p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Sales Rewards Hub
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Employee Incentive System</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Crush your deal targets, unlock exclusive performance badges, and earn cash rewards deposited directly into your monthly commissions!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-panel px-5 py-4 rounded-2xl border border-emerald-500/20 text-center">
              <p className="text-xs text-slate-400">Total Claimed</p>
              <p className="text-2xl font-extrabold text-emerald-400">₹{totalRewardsClaimed.toLocaleString()}</p>
            </div>
            <div className="glass-panel px-5 py-4 rounded-2xl border border-indigo-500/20 text-center">
              <p className="text-xs text-slate-400">Claimable Rewards</p>
              <p className="text-2xl font-extrabold text-indigo-400">{claimableCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Challenges & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Milestone Challenges */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Active Milestone Challenges
            </h2>
            <span className="text-xs text-slate-400">{incentives.length} Challenges Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incentives.map((item) => {
              const isClaimed = item.status === 'CLAIMED';
              const isClaimable = item.status === 'CLAIMABLE';
              const pct = item.percentageComplete || 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-panel p-6 rounded-3xl space-y-4 border transition-all duration-300 ${
                    isClaimed 
                      ? 'border-emerald-500/30 bg-emerald-950/10' 
                      : isClaimable 
                      ? 'border-amber-500/40 bg-amber-950/20 shadow-lg shadow-amber-500/10' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      {getBadgeIcon(item.incentive?.badgeIcon)}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      +₹{item.incentive?.rewardAmount?.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{item.incentive?.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.incentive?.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isClaimed ? 'bg-emerald-500' : isClaimable ? 'bg-amber-400 animate-pulse' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {isClaimed ? (
                      <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Reward Claimed
                      </div>
                    ) : isClaimable ? (
                      <button
                        onClick={() => handleClaim(item.incentive?.id)}
                        disabled={claimingId === item.incentive?.id}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" /> 
                        {claimingId === item.incentive?.id ? 'Claiming...' : 'Claim Reward Now!'}
                      </button>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium text-center">
                        In Progress ({item.currentProgress} / {item.targetValue})
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sales Leaderboard */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-indigo-400" />
              Sales Leaderboard
            </h2>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No active leaderboard data yet.</p>
            ) : (
              leaderboard.map((user) => (
                <div 
                  key={user.employeeId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.employeeName} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
                          {user.employeeName?.charAt(0) || 'E'}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{user.employeeName}</h4>
                      <p className="text-xs text-indigo-400 font-medium">{user.salesTier}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400">₹{user.totalRevenue?.toLocaleString()}</p>
                    <div className="mt-0.5">{getRankBadge(user.rank)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
