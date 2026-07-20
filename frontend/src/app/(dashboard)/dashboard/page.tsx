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
  AlertCircle,
  Quote,
  ShieldAlert
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
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value === undefined ? <div className="h-8 w-24 bg-slate-800 rounded animate-pulse" /> : value}
        </h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

function AdminDashboardView({ stats }: { stats: DashboardStats | null }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue (Month)" value={formatCurrency(stats?.monthlyRevenue || 0)} icon={TrendingUp} color="indigo" delay={0.1} />
        <StatCard title="Pending KYC Approvals" value={stats?.totalEmployees || 0} icon={ShieldAlert} color="amber" delay={0.2} />
        <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={Target} color="violet" delay={0.3} />
        <StatCard title="End of Month Payouts" value={formatCurrency(stats?.pendingCommissions || 0)} icon={AlertCircle} color="emerald" delay={0.4} />
      </div>
    </>
  );
}

function ManagerDashboardView({ stats }: { stats: DashboardStats | null }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Team Revenue" value={formatCurrency(stats?.totalRevenue || 0)} icon={TrendingUp} color="indigo" delay={0.1} />
        <StatCard title="Team Open Leads" value={stats?.openLeads || 0} icon={Target} color="cyan" delay={0.2} />
        <StatCard title="Team Won Deals" value={stats?.wonDeals || 0} icon={Briefcase} color="emerald" delay={0.3} />
        <StatCard title="Avg Conversion Rate" value={`${stats?.conversionRate || 0}%`} icon={TrendingUp} color="violet" delay={0.4} />
      </div>
    </>
  );
}

function EmployeeDashboardView({ stats }: { stats: DashboardStats | null }) {
  const [quote, setQuote] = useState({ text: "Loading motivation...", author: "" });

  useEffect(() => {
    fetch('https://quotesapi.prayushadhikari.com.np/api/quotes/random')
      .then(res => res.json())
      .then(data => {
        if(data && data.length > 0) {
          setQuote({ text: data[0].quote, author: data[0].author });
        }
      })
      .catch(() => {
        setQuote({ text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" });
      });
  }, []);

  return (
    <>
      {/* Tenure & Motivation Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden"
        >
          <Quote className="absolute top-4 right-4 w-24 h-24 text-emerald-500/10 -rotate-12" />
          <div className="relative z-10">
            <p className="text-xl italic text-slate-200 mb-2">&quot;{quote.text}&quot;</p>
            {quote.author && <p className="text-sm text-emerald-400 font-medium">— {quote.author}</p>}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="glass-panel rounded-2xl p-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent flex flex-col justify-center items-center text-center"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">You&apos;re crushing it!</h3>
          <p className="text-sm text-indigo-300 mt-1">Keep up the great momentum this month.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Revenue" value={formatCurrency(stats?.totalRevenue || 0)} icon={TrendingUp} color="indigo" delay={0.2} />
        <StatCard title="My Open Leads" value={stats?.openLeads || 0} icon={Target} color="cyan" delay={0.3} />
        <StatCard title="Won Deals" value={stats?.wonDeals || 0} icon={Briefcase} color="violet" delay={0.4} />
        <StatCard title="Conversion Rate" value={`${stats?.conversionRate || 0}%`} icon={TrendingUp} color="emerald" delay={0.5} />
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN');
  const isManager = roles.includes('SALES_MANAGER');
  const isEmployee = !isAdmin && !isManager; // Default fallback to employee

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

      {/* Role-based Dashboard Views */}
      {isAdmin && <AdminDashboardView stats={stats} />}
      {isManager && !isAdmin && <ManagerDashboardView stats={stats} />}
      {isEmployee && <EmployeeDashboardView stats={stats} />}

      {/* Shared Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
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

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
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
