'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  Clock,
  Search,
  ExternalLink,
  RefreshCcw,
  Lock,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KycApprovalPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes('ADMIN');

  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Reject Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectId, setRejectId] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
    }
  }, [isAdmin]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/employees');
      // Sort to show SUBMITTED first, then PENDING/CLARIFICATION_NEEDED, then FROZEN, then VERIFIED
      const sorted = (data.data.content || []).sort((a: any, b: any) => {
        const order: any = { 'SUBMITTED': 1, 'CLARIFICATION_NEEDED': 2, 'PENDING': 3, 'FROZEN': 4, 'VERIFIED': 5 };
        return (order[a.kycStatus] || 99) - (order[b.kycStatus] || 99);
      });
      setEmployees(sorted);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await api.post(`/employees/${id}/kyc/verify`);
      toast.success('KYC Verified Successfully');
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to verify KYC');
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/employees/${rejectId}/kyc/reject`, { reason: rejectReason });
      toast.success('KYC Rejected, user notified');
      setShowRejectModal(false);
      setRejectReason('');
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to reject KYC');
    }
  };

  const handleReconsider = async (id: string) => {
    try {
      await api.post(`/employees/${id}/kyc/reconsider`);
      toast.success('Account reconsidered, attempts reset');
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to reconsider account');
    }
  };

  const openRejectModal = (id: string) => {
    setRejectId(id);
    setShowRejectModal(true);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    emp.employeeNumber?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-red-500/50 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400">You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-400" />
            KYC Approval Queue
          </h2>
          <p className="text-slate-400 mt-1">Review and verify employee identity documents.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-indigo-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-indigo-500/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-400 border-b border-indigo-500/10">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">ID Info</th>
                <th className="px-6 py-4 font-medium">Bank Details</th>
                <th className="px-6 py-4 font-medium">Status & Attempts</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-indigo-500/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{emp.fullName}</div>
                      <div className="text-xs text-slate-500">{emp.employeeNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 flex items-center gap-1">
                        <span className="text-indigo-300 text-xs font-bold">{emp.countryOfId || 'N/A'}</span>
                        <span className="text-slate-500">•</span>
                        <span>{emp.nationalId || 'N/A'}</span>
                      </div>
                      {emp.kycDocumentPath && (
                        <a 
                          href={`/api/files/${emp.kycDocumentPath}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View Document
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-medium">{emp.bankName || 'No Bank Details'}</div>
                      {emp.bankAccount && (
                        <div className="text-xs text-slate-400 font-mono mt-1">AC: {emp.bankAccount}</div>
                      )}
                      {emp.bankIfsc && (
                        <div className="text-xs text-slate-400 font-mono">IFSC: {emp.bankIfsc}</div>
                      )}
                      {emp.upiId && (
                        <div className="text-xs text-emerald-400 mt-1">UPI: {emp.upiId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        {emp.kycStatus === 'VERIFIED' && <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20"><CheckCircle2 className="w-3 h-3 inline mr-1" />VERIFIED</span>}
                        {emp.kycStatus === 'SUBMITTED' && <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20"><Clock className="w-3 h-3 inline mr-1" />SUBMITTED</span>}
                        {emp.kycStatus === 'PENDING' && <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs border border-slate-700">PENDING</span>}
                        {emp.kycStatus === 'CLARIFICATION_NEEDED' && <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-xs border border-orange-500/20"><XCircle className="w-3 h-3 inline mr-1" />REJECTED</span>}
                        {emp.kycStatus === 'FROZEN' && <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20"><Lock className="w-3 h-3 inline mr-1" />FROZEN</span>}
                        
                        {(emp.kycAttempts !== undefined && emp.kycAttempts > 0) && (
                          <span className="text-[10px] text-slate-500">Attempts: {emp.kycAttempts}/4</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {emp.kycStatus === 'SUBMITTED' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleVerify(emp.id)} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded border border-emerald-500/20 transition-colors">
                            Verify
                          </button>
                          <button onClick={() => openRejectModal(emp.id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded border border-red-500/20 transition-colors">
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {emp.kycStatus === 'FROZEN' && (
                        <button onClick={() => handleReconsider(emp.id)} className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium rounded border border-amber-500/20 transition-colors flex items-center gap-1">
                          <RefreshCcw className="w-3 h-3" /> Reconsider
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-panel rounded-2xl border border-indigo-500/20 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-indigo-500/10 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  Reject KYC
                </h3>
                <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleReject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Reason for rejection (sent to employee)</label>
                    <textarea 
                      required
                      rows={3}
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="e.g. The ID document is blurry, please re-upload a clear copy."
                      className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors">
                      Confirm Rejection
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
