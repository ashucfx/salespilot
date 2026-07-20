'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, User, Building2, Briefcase, Mail, Phone, MoreHorizontal, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function TeamPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  // Protect route
  useEffect(() => {
    if (user && !user.roles?.includes('ADMIN') && !user.roles?.includes('SALES_MANAGER')) {
      router.replace('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, router]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data: responseData } = await api.get('/employees');
      const pageData = responseData?.data || responseData;
      setEmployees(pageData.content || (Array.isArray(pageData) ? pageData : []));
    } catch (err) {
      console.error('Failed to fetch employees', err);
      toast.error('Failed to load team members');
      // Mock data for development when backend is down
      setEmployees([
        { id: 1, firstName: 'Alex', lastName: 'Johnson', email: 'alex@salespilot.com', roles: ['SALES_REP'], designation: 'Senior Account Executive', kycStatus: 'VERIFIED', commissionRate: 10, joiningDate: '2024-01-15' },
        { id: 2, firstName: 'Sarah', lastName: 'Williams', email: 'sarah@salespilot.com', roles: ['SALES_REP'], designation: 'Sales Development Rep', kycStatus: 'PENDING', commissionRate: 10, joiningDate: '2025-06-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Team Management</h2>
          <p className="text-slate-400 text-sm mt-1">Manage sales representatives and their commissions.</p>
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Onboard Employee
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search team members by name or email..."
            className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <button className="px-4 py-2 bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-300 border border-indigo-500/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : employees.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No team members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee, i) => (
            <Link href={`/team/${employee.id}`} key={employee.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel p-6 rounded-3xl hover:bg-slate-800/50 transition-all cursor-pointer group relative h-full flex flex-col"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 text-slate-400 hover:text-white bg-slate-900/80 rounded-xl backdrop-blur-sm transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-400 shrink-0">
                    {employee.firstName?.charAt(0) || employee.email?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight truncate">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-xs text-indigo-400 mt-1 font-medium tracking-wide">
                      {employee.designation || 'Sales Representative'}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                        Tenure: {employee.joiningDate ? (() => {
                          const start = new Date(employee.joiningDate);
                          const now = new Date();
                          const diffTime = Math.abs(now.getTime() - start.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          if (diffDays < 30) return `${diffDays} days`;
                          if (diffDays < 365) return `${Math.floor(diffDays / 30)} mos`;
                          return `${Math.floor(diffDays / 365)} yrs`;
                        })() : 'New'}
                      </span>
                      {employee.kycStatus === 'VERIFIED' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> KYC Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-medium text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> KYC Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">{employee.workEmail || employee.personalEmail || 'No Email'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Department: {employee.department || 'Sales'}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
