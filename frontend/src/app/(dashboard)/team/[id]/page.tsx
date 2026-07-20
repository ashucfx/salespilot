'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, User, Mail, ShieldAlert, CheckCircle2, 
  Briefcase, DollarSign, Target, Activity, Settings 
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TeamMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      // Mock data for development
      setEmployee({
        id,
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@salespilot.com',
        roles: ['SALES_REP'],
        kycStatus: 'VERIFIED',
        commissionRate: 10,
        createdAt: new Date().toISOString(),
      });
      setSummary({
        totalWonDeals: 5,
        totalPendingCommissions: 2500,
        totalPaidCommissions: 12000,
      });

      // Actual API calls would be:
      // const { data: empData } = await api.get(`/employees/${id}`);
      // const { data: summaryData } = await api.get(`/analytics/admin/payout-summary`);
      // setEmployee(empData);
    } catch (err) {
      console.error('Failed to load employee', err);
      toast.error('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommission = async () => {
    try {
      // await api.put(`/analytics/admin/commissions/rule`, { employeeId: id, percentage: commissionRate });
      toast.success('Commission rate updated successfully');
      setIsEditingCommission(false);
      setEmployee((prev: any) => ({ ...prev, commissionRate }));
    } catch (err) {
      toast.error('Failed to update commission rate');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-white">Employee not found</h2>
        <button onClick={() => router.push('/team')} className="mt-4 text-indigo-400 hover:text-indigo-300">
          Return to Team
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/team" className="p-2 rounded-xl bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            {employee.firstName} {employee.lastName}
            {employee.kycStatus === 'VERIFIED' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            )}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{employee.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl md:col-span-1 space-y-6 h-fit">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-400">
              {employee.firstName?.charAt(0) || employee.email?.charAt(0) || 'U'}
            </div>
            <div>
              <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 uppercase tracking-wider">
                {employee.roles?.[0] || 'EMPLOYEE'}
              </span>
              <p className="text-sm text-slate-500 mt-2">Joined {new Date(employee.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/50 space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Commission Plan</p>
              {isEditingCommission ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-20 bg-slate-900 border border-indigo-500/30 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <span className="text-slate-400">%</span>
                  <button onClick={handleUpdateCommission} className="ml-2 text-sm text-emerald-400 hover:text-emerald-300">Save</button>
                  <button onClick={() => setIsEditingCommission(false)} className="text-sm text-slate-400 hover:text-slate-300">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">{employee.commissionRate || 10}%</span>
                  <button onClick={() => setIsEditingCommission(true)} className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/10 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-1">KYC Status</p>
              {employee.kycStatus === 'VERIFIED' ? (
                <span className="text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Fully Verified
                </span>
              ) : (
                <span className="text-amber-400 font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Pending Verification
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Paid Commissions</h3>
              </div>
              <p className="text-3xl font-bold text-white">${summary?.totalPaidCommissions?.toLocaleString() || 0}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl">
              <div className="flex items-center gap-3 text-amber-400 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Pending Commissions</h3>
              </div>
              <p className="text-3xl font-bold text-white">${summary?.totalPendingCommissions?.toLocaleString() || 0}</p>
            </motion.div>
          </div>

          {/* Activity Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-4">Recent Deals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Acme Corp Enterprise Deal</p>
                    <p className="text-xs text-slate-400">Closed on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">+$2,500</p>
                  <p className="text-xs text-slate-400">Commission Earned</p>
                </div>
              </div>
            </div>
            <button onClick={() => router.push('/deals')} className="w-full mt-4 py-3 border border-indigo-500/20 rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-colors text-sm font-medium">
              View All Deals
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
