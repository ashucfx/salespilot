'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Briefcase,
  AlertCircle,
  Quote,
  ShieldAlert,
  Plus,
  CalendarDays,
  DollarSign,
  User
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
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-foreground tracking-tight">
          {value === undefined ? <div className="h-8 w-24 bg-muted rounded animate-pulse" /> : value}
        </h3>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

function AdminDashboardView({ stats }: { stats: DashboardStats | null }) {
  const [pendingKyc, setPendingKyc] = useState<number | null>(null);

  useEffect(() => {
    api.get('/employees/kyc?status=PENDING&size=1')
      .then(res => {
        const total = res.data?.data?.totalElements ?? res.data?.data?.total ?? null;
        if (total !== null) { setPendingKyc(total); return; }
        // fallback: try submitted too
        api.get('/employees/kyc?status=SUBMITTED&size=1').then(r2 => {
          const t2 = r2.data?.data?.totalElements ?? 0;
          setPendingKyc((total ?? 0) + t2);
        }).catch(() => setPendingKyc(0));
      })
      .catch(() => {
        // Try alternate endpoint
        api.get('/kyc/pending').then(r => {
          const list = r.data?.data?.content || r.data?.data || r.data || [];
          setPendingKyc(Array.isArray(list) ? list.length : r.data?.data?.totalElements ?? 0);
        }).catch(() => setPendingKyc(0));
      });
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue (Month)" value={formatCurrency(stats?.monthlyRevenue || 0)} icon={TrendingUp} color="indigo" delay={0.1} />
        <StatCard title="Pending KYC Approvals" value={pendingKyc ?? '...'} icon={ShieldAlert} color="amber" delay={0.2} />
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
  const [quote, setQuote] = useState({ text: 'Loading motivation...', author: '' });

  useEffect(() => {
    fetch('https://quotesapi.prayushadhikari.com.np/api/quotes/random')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setQuote({ text: data[0].quote, author: data[0].author });
        }
      })
      .catch(() => {
        setQuote({ text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' });
      });
  }, []);

  return (
    <>
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
          <h3 className="text-lg font-bold text-foreground">You&apos;re crushing it!</h3>
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
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<{ name: string; revenue: number }[]>([]);

  const roles = user?.roles || [];
  const isAdmin = roles.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN');
  const isManager = roles.some(r => r === 'SALES_MANAGER' || r === 'ROLE_SALES_MANAGER');
  const isEmployee = !isAdmin && !isManager;

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

    const fetchRevenueChart = async () => {
      try {
        const { data } = await api.get('/analytics/revenue-trend');
        const trend = data?.data || data || [];
        if (Array.isArray(trend) && trend.length > 0) {
          setRevenueData(trend);
        } else {
          buildFallbackChart();
        }
      } catch {
        buildFallbackChart();
      }
    };

    const buildFallbackChart = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      setRevenueData(
        Array.from({ length: 6 }, (_, i) => ({
          name: months[(now.getMonth() - 5 + i + 12) % 12],
          revenue: 0
        }))
      );
    };

    fetchStats();
    fetchRevenueChart();
  }, [isAdmin]);

  const adminQuickActions = [
    { label: 'Add New Lead', icon: Plus, href: '/leads' },
    { label: 'Schedule Meeting', icon: CalendarDays, href: '/meetings' },
    { label: 'View Commissions', icon: DollarSign, href: '/commissions' },
    { label: 'Team Overview', icon: Users, href: '/team' },
    { label: 'KYC Approvals', icon: ShieldAlert, href: '/kyc' },
    { label: 'My Profile', icon: User, href: '/profile' },
  ];

  const managerQuickActions = [
    { label: 'Add New Lead', icon: Plus, href: '/leads' },
    { label: 'Team Overview', icon: Users, href: '/team' },
    { label: 'View Commissions', icon: DollarSign, href: '/commissions' },
    { label: 'My Targets', icon: Target, href: '/targets' },
    { label: 'My Profile', icon: User, href: '/profile' },
  ];

  const employeeQuickActions = [
    { label: 'Add New Lead', icon: Plus, href: '/leads' },
    { label: 'Schedule Meeting', icon: CalendarDays, href: '/meetings' },
    { label: 'My Targets', icon: Target, href: '/targets' },
    { label: 'My Payouts', icon: DollarSign, href: '/payouts' },
    { label: 'Incentives Hub', icon: Briefcase, href: '/incentives' },
    { label: 'My Profile', icon: User, href: '/profile' },
  ];

  const quickActions = isAdmin ? adminQuickActions : isManager ? managerQuickActions : employeeQuickActions;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.firstName || user?.fullName || user?.email?.split('@')[0]} 👋
        </h2>
        <p className="text-muted-foreground">
          Here is what&apos;s happening with your sales today.
        </p>
      </div>

      {isAdmin && <AdminDashboardView stats={stats} />}
      {isManager && !isAdmin && <ManagerDashboardView stats={stats} />}
      {isEmployee && <EmployeeDashboardView stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-indigo-500/10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
            {loading && <div className="text-xs text-slate-500 animate-pulse">Loading...</div>}
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', borderColor: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="glass-panel rounded-2xl p-6 border border-indigo-500/10 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-2 flex-1">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="w-full text-left px-4 py-3 rounded-xl bg-muted/50 hover:bg-indigo-500/20 hover:text-indigo-300 text-muted-foreground text-sm font-medium transition-all border border-transparent hover:border-indigo-500/20 flex items-center gap-3"
              >
                <action.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
