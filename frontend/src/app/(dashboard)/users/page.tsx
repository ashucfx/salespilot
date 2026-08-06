'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { 
  Users, 
  Plus,
  Mail,
  User,
  Briefcase,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Trash2,
  KeyRound,
  X,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes('ADMIN');
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    roleName: 'SALES_EMPLOYEE'
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Deletion State
  const [showDeleteOtpModal, setShowDeleteOtpModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any>(null);
  const [deleteOtpInput, setDeleteOtpInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInitiateDelete = async (emp: any) => {
    try {
      setEmployeeToDelete(emp);
      setDeleteOtpInput('');
      await api.post(`/employees/${emp.id}/delete-otp`);
      toast.success('OTP sent to your admin email address.');
      setShowDeleteOtpModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate deletion OTP');
    }
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeToDelete || !deleteOtpInput.trim()) return;
    setIsDeleting(true);
    try {
      await api.delete(`/employees/${employeeToDelete.id}?otp=${encodeURIComponent(deleteOtpInput.trim())}`);
      toast.success('Employee deleted successfully.');
      setShowDeleteOtpModal(false);
      setEmployeeToDelete(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete employee with OTP');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: responseData } = await api.get('/employees');
      const pageData = responseData?.data || responseData;
      setEmployees(pageData?.content || (Array.isArray(pageData) ? pageData : []));
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSuccessMsg('');
      await api.post('/admin/users/onboard', onboardForm);
      setSuccessMsg('User onboarded successfully! An email with their temporary password has been sent.');
      setOnboardForm({ email: '', firstName: '', lastName: '', roleName: 'SALES_EMPLOYEE' });
      fetchUsers();
      setTimeout(() => setShowModal(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to onboard user');
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            User Management
          </h2>
          <p className="text-slate-400 mt-1">Manage employees, sales managers, and access rights.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Onboard User
        </button>
      </div>

      {/* Employees Table */}
      <div className="glass-panel rounded-2xl border border-indigo-500/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-400 border-b border-indigo-500/10">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-indigo-500/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-medium">
                          {emp.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-white">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-slate-500">{emp.employeeNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{emp.workEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      System Access
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleInitiateDelete(emp)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors inline-flex items-center justify-center"
                        title="Delete Employee via OTP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-panel rounded-2xl border border-indigo-500/20 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-indigo-500/10 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-white">Onboard New User</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              
              <div className="p-6">
                {successMsg ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                    <p className="text-emerald-300 font-medium">{successMsg}</p>
                  </div>
                ) : (
                  <form onSubmit={handleOnboardSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-400">First Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input required type="text" value={onboardForm.firstName} onChange={e => setOnboardForm({...onboardForm, firstName: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500" placeholder="John" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-400">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input required type="text" value={onboardForm.lastName} onChange={e => setOnboardForm({...onboardForm, lastName: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500" placeholder="Doe" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-400">Work Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input required type="email" value={onboardForm.email} onChange={e => setOnboardForm({...onboardForm, email: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500" placeholder="john.doe@company.com" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-400">Access Role</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <select value={onboardForm.roleName} onChange={e => setOnboardForm({...onboardForm, roleName: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-slate-900/50 border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500 appearance-none">
                          <option value="SALES_EMPLOYEE">Sales Employee</option>
                          <option value="SALES_MANAGER">Sales Manager</option>
                          <option value="ADMIN">Administrator</option>
                        </select>
                      </div>
                    </div>

                    <button disabled={submitting} type="submit" className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitting ? 'Onboarding...' : 'Onboard User'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OTP Deletion Modal */}
      <AnimatePresence>
        {showDeleteOtpModal && employeeToDelete && (
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
                  You are initiating a permanent database deletion for <strong className="text-white">{employeeToDelete.firstName} {employeeToDelete.lastName}</strong> ({employeeToDelete.workEmail}).
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
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-rose-500/30 rounded-lg text-foreground font-mono text-center tracking-[0.3em] text-lg focus:outline-none focus:border-rose-500" 
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
