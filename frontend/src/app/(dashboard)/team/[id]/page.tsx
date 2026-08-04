'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, User, Mail, ShieldAlert, CheckCircle2, 
  Briefcase, DollarSign, Target, Activity, Settings,
  Trash2, KeyRound, X, Lock, AlertTriangle, Calendar, Check, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10);
  const [summary, setSummary] = useState<any>(null);
  const [recentDeals, setRecentDeals] = useState<any[]>([]);

  // Contract & Resignation & Deletion State
  const [isEditingContract, setIsEditingContract] = useState(false);
  const [contractDate, setContractDate] = useState('');
  const [showDeleteOtpModal, setShowDeleteOtpModal] = useState(false);
  const [deleteOtpInput, setDeleteOtpInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const { data: empRes } = await api.get(`/employees/${id}`);
      const empData = empRes?.data || empRes;
      if (empData) {
        setEmployee(empData);
        setCommissionRate(empData.commissionRate || 10);
        setContractDate(empData.contractEndDate || '');
      }

      const { data: commRes } = await api.get(`/commissions/employee/${id}`);
      const commList = commRes?.data?.content || commRes?.data || commRes?.content || commRes || [];
      const commArray = Array.isArray(commList) ? commList : [];
      const totalPaid = commArray.filter((c: any) => c.status === 'PAID').reduce((acc: number, c: any) => acc + (Number(c.commissionAmount) || 0), 0);
      const totalPending = commArray.filter((c: any) => c.status === 'PENDING').reduce((acc: number, c: any) => acc + (Number(c.commissionAmount) || 0), 0);
      
      const { data: dealsRes } = await api.get(`/deals/employee/${id}`);
      const dealsList = dealsRes?.data?.content || dealsRes?.data || dealsRes?.content || dealsRes || [];
      const dealsArray = Array.isArray(dealsList) ? dealsList : [];
      setRecentDeals(dealsArray);

      setSummary({
        totalWonDeals: dealsArray.length,
        totalPendingCommissions: totalPending,
        totalPaidCommissions: totalPaid,
      });
    } catch (err) {
      console.error('Failed to load employee', err);
      toast.error('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommission = async () => {
    try {
      await api.put(`/commissions/employee/${id}/rule?percentage=${commissionRate}`);
      toast.success('Commission rate updated successfully');
      setIsEditingCommission(false);
      setEmployee((prev: any) => ({ ...prev, commissionRate }));
    } catch (err) {
      toast.error('Failed to update commission rate');
    }
  };

  const handleUpdateContract = async () => {
    try {
      await api.put(`/employees/${id}/contract-date`, { contractEndDate: contractDate });
      toast.success('Contract end date updated successfully');
      setIsEditingContract(false);
      setEmployee((prev: any) => ({ ...prev, contractEndDate: contractDate }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update contract date');
    }
  };

  const handleApproveResignation = async () => {
    try {
      const endDate = contractDate || new Date().toISOString().split('T')[0];
      await api.post(`/employees/${id}/resignation/approve`, { endDate });
      toast.success('Resignation approved.');
      fetchEmployeeDetails();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve resignation');
    }
  };

  const handleRejectResignation = async () => {
    try {
      await api.post(`/employees/${id}/resignation/reject`, { reason: 'Admin rejected' });
      toast.success('Resignation rejected.');
      fetchEmployeeDetails();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject resignation');
    }
  };

  const handleInitiateDelete = async () => {
    try {
      setDeleteOtpInput('');
      await api.post(`/employees/${id}/delete-otp`);
      toast.success('OTP sent to your admin email address.');
      setShowDeleteOtpModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate deletion OTP');
    }
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteOtpInput.trim()) return;
    setIsDeleting(true);
    try {
      await api.delete(`/employees/${id}?otp=${encodeURIComponent(deleteOtpInput.trim())}`);
      toast.success('Employee deleted successfully.');
      setShowDeleteOtpModal(false);
      router.push('/team');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete employee with OTP');
    } finally {
      setIsDeleting(false);
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
              <p className="text-sm text-slate-400 mt-2 font-semibold">Joined: <span className="text-indigo-400">{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}</span></p>
            </div>
          </div>
          <div className="w-full">
            <Link href={`/team/${id}/offer-letter`} className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e]/60 border border-indigo-500/20 hover:bg-indigo-500/10 text-white px-4 py-2 rounded-xl transition-colors text-sm font-medium">
              <Mail className="w-4 h-4 text-indigo-400" />
              Generate Offer Letter
            </Link>
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

            <div>
              <p className="text-sm text-slate-400 mb-1">Contract End Date</p>
              {isEditingContract ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={contractDate}
                    onChange={(e) => setContractDate(e.target.value)}
                    className="bg-slate-900 border border-indigo-500/30 rounded-lg px-2 py-1 text-white text-xs focus:outline-none w-32"
                  />
                  <button onClick={handleUpdateContract} className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">Save</button>
                  <button onClick={() => setIsEditingContract(false)} className="text-xs text-slate-400 hover:text-slate-300">Cancel</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {employee.contractEndDate || 'No Contract Date Set'}
                  </span>
                  <button onClick={() => setIsEditingContract(true)} className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/10 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {employee.resignationStatus && employee.resignationStatus !== 'NONE' && (
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Resignation: {employee.resignationStatus}
                  </span>
                </div>
                {employee.resignationReason && (
                  <p className="text-xs text-slate-300 italic">"{employee.resignationReason}"</p>
                )}
                {employee.resignationStatus === 'SUBMITTED' && (
                  <div className="flex items-center gap-2 pt-1.5 border-t border-rose-500/10">
                    <button 
                      onClick={handleApproveResignation} 
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
                    >
                      Approve Exit
                    </button>
                    <button 
                      onClick={handleRejectResignation} 
                      className="flex-1 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/30 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/50">
              <button 
                onClick={handleInitiateDelete} 
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Employee via OTP</span>
              </button>
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
            <h3 className="text-lg font-bold text-white mb-4">Recent Deals ({recentDeals.length})</h3>
            <div className="space-y-4">
              {recentDeals.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No deals recorded for this team member yet.</p>
              ) : (
                recentDeals.slice(0, 5).map((deal: any, index: number) => (
                  <div key={deal.id || index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{deal.title || deal.name || `Deal #${deal.dealNumber || index + 1}`}</p>
                        <p className="text-xs text-slate-400">Closed on {deal.closedAt ? new Date(deal.closedAt).toLocaleDateString() : 'Recent'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">${Number(deal.value || deal.dealValue || 0).toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Deal Value</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => router.push('/deals')} className="w-full mt-4 py-3 border border-indigo-500/20 rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-colors text-sm font-medium">
              View All Deals
            </button>
          </motion.div>
        </div>
      </div>

      {/* OTP Deletion Modal */}
      <AnimatePresence>
        {showDeleteOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-panel rounded-2xl border border-rose-500/30 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-rose-500/20 flex justify-between items-center bg-rose-950/20">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Confirm OTP Deletion</span>
                </div>
                <button onClick={() => setShowDeleteOtpModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmDelete} className="p-6 space-y-4">
                <p className="text-sm text-slate-300">
                  You are initiating a permanent database deletion for <strong className="text-white">{employee.firstName} {employee.lastName}</strong>.
                </p>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-indigo-500/20 text-xs text-indigo-300">
                  A 6-digit verification token has been dispatched to your administrator email address. Please enter it below to confirm deletion.
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin OTP Token</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input 
                      required 
                      type="text" 
                      maxLength={6}
                      value={deleteOtpInput} 
                      onChange={e => setDeleteOtpInput(e.target.value)} 
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-rose-500/30 rounded-lg text-white font-mono text-center tracking-[0.3em] text-lg focus:outline-none focus:border-rose-500" 
                      placeholder="123456" 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteOtpModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={isDeleting || !deleteOtpInput.trim()} 
                    type="submit" 
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    <span>Confirm Delete</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
