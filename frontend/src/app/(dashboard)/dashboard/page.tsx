'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardStats {
  totalLeads?: number;
  openLeads?: number;
  wonDeals?: number;
  totalRevenue?: number;
  totalDeals?: number;
  paidCommission?: number;
  pendingCommission?: number;
  conversionRate?: number;
  // Admin stats
  totalEmployees?: number;
  totalWon?: number;
  totalLost?: number;
  monthlyRevenue?: number;
  pendingCommissions?: number;
}

// Dummy data for the chart
const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 8000 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 10000 },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.roles?.includes('ADMIN');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint = isAdmin ? '/analytics/admin' : '/analytics/me';
        const { data } = await api.get(endpoint);
        setStats(data.data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-panel rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {loading ? <div className="h-9 w-24 bg-slate-800 rounded animate-pulse" /> : value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white">
          Welcome back, {user?.email?.split('@')[0]}
        </h2>
        <p className="text-slate-400">
          Here is what&apos;s happening with your sales today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard 
              title="Total Revenue (Month)" 
              value={formatCurrency(stats?.monthlyRevenue || 0)} 
              icon={TrendingUp} 
              color="indigo" 
              delay={0.1} 
            />
            <StatCard 
              title="Total Employees" 
              value={stats?.totalEmployees || 0} 
              icon={Users} 
              color="cyan" 
              delay={0.2} 
            />
            <StatCard 
              title="Total Leads" 
              value={stats?.totalLeads || 0} 
              icon={Target} 
              color="violet" 
              delay={0.3} 
            />
            <StatCard 
              title="Pending Commissions" 
              value={formatCurrency(stats?.pendingCommissions || 0)} 
              icon={AlertCircle} 
              color="warning" 
              delay={0.4} 
            />
          </>
        ) : (
          <>
            <StatCard 
              title="My Revenue" 
              value={formatCurrency(stats?.totalRevenue || 0)} 
              icon={TrendingUp} 
              color="indigo" 
              delay={0.1} 
            />
            <StatCard 
              title="Open Leads" 
              value={stats?.openLeads || 0} 
              icon={Target} 
              color="cyan" 
              delay={0.2} 
            />
            <StatCard 
              title="Won Deals" 
              value={stats?.wonDeals || 0} 
              icon={Briefcase} 
              color="violet" 
              delay={0.3} 
            />
            <StatCard 
              title="Conversion Rate" 
              value={`${stats?.conversionRate || 0}%`} 
              icon={TrendingUp} 
              color="emerald" 
              delay={0.4} 
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-indigo-500/10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions / Recent Activity placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="glass-panel rounded-2xl p-6 border border-indigo-500/10 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          <div className="space-y-4 flex-1">
            {['Create New Lead', 'Schedule Meeting', 'View Commissions', 'Update Profile'].map((action, i) => (
              <button 
                key={i}
                className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-300 text-sm font-medium transition-colors border border-transparent hover:border-indigo-500/20"
              >
                {action}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
