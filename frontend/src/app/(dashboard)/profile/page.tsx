'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  User, ShieldAlert, CheckCircle2, 
  Briefcase, Activity, CreditCard, Save, Lock, Upload, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);
  
  // KYC Form State
  const [kycForm, setKycForm] = useState({
    countryOfId: '',
    nationalId: '',
    kycDocumentPath: '',
    upiId: '',
    bankName: '',
    bankAccount: '',
    bankIfsc: ''
  });
  
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Resignation State
  const [showResignModal, setShowResignModal] = useState(false);
  const [resignReason, setResignReason] = useState('');
  const [isSubmittingResignation, setIsSubmittingResignation] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const { data } = await api.get('/employees/me');
      setProfile(data.data);
      
      // Also fetch stats for the summary block
      const statsRes = await api.get('/analytics/me');
      setSummary(statsRes.data.data);
    } catch (err) {
      console.error('Failed to load profile', err);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Only allow PDFs or Images up to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'kyc-documents');

    try {
      setUploading(true);
      const { data } = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setKycForm({ ...kycForm, kycDocumentPath: data.data });
      toast.success('Document uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload document');
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycForm.kycDocumentPath) {
      toast.error('Please upload your KYC document before submitting.');
      return;
    }

    setIsSubmittingKyc(true);
    try {
      await api.post('/employees/me/kyc', kycForm);
      toast.success('KYC details submitted successfully. Pending verification.');
      fetchProfileData(); // Refresh to see SUBMITTED status
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit KYC details');
    } finally {
      setIsSubmittingKyc(false);
    }
  };

  const handleResignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingResignation(true);
    try {
      await api.post('/employees/me/resignation', { reason: resignReason });
      toast.success('Resignation submitted successfully.');
      setShowResignModal(false);
      fetchProfileData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit resignation');
    } finally {
      setIsSubmittingResignation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <span className="text-emerald-400 font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Fully Verified</span>;
      case 'PENDING': return <span className="text-slate-400 font-medium flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Action Required</span>;
      case 'SUBMITTED': return <span className="text-amber-400 font-medium flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Under Review</span>;
      case 'CLARIFICATION_NEEDED': return <span className="text-orange-400 font-medium flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Clarification Needed</span>;
      case 'FROZEN': return <span className="text-red-400 font-medium flex items-center gap-2"><Lock className="w-4 h-4" /> Account Frozen</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">My Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your account, KYC details, and track performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Summary Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-400">
                {profile?.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white truncate">{profile?.fullName}</h3>
                <span className="px-2 py-1 mt-1 inline-block rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 uppercase tracking-wider">
                  {user?.roles?.[0] || 'EMPLOYEE'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/50 space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Employee Number</p>
                <span className="font-medium text-white">{profile?.employeeNumber}</span>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">KYC Status</p>
                {getStatusBadge(profile?.kycStatus)}
                {profile?.kycStatus === 'CLARIFICATION_NEEDED' && (
                  <p className="text-xs text-orange-400 mt-2 bg-orange-400/10 p-2 rounded">
                    {profile.notes || 'Please re-submit your documents.'}
                  </p>
                )}
                {profile?.kycStatus === 'FROZEN' && (
                  <p className="text-xs text-red-400 mt-2 bg-red-400/10 p-2 rounded">
                    You have exceeded the maximum KYC attempts. Please contact the administrator.
                  </p>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-800/50">
                <p className="text-sm text-slate-400 mb-1">Employment Status</p>
                {profile?.resignationStatus ? (
                  <div className="space-y-2">
                    <span className="px-2 py-1 inline-block rounded bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 uppercase tracking-wider">
                      Resignation {profile.resignationStatus}
                    </span>
                    {profile.resignationStatus === 'APPROVED' && profile.endDate && (
                      <p className="text-xs text-slate-400">Your last day will be <span className="text-white font-medium">{profile.endDate}</span>.</p>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setShowResignModal(true)} className="text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors">
                    Submit Resignation
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Performance Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              My Performance
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                <span className="text-sm text-slate-400">Paid Commissions</span>
                <span className="font-bold text-emerald-400">₹{summary?.paidCommission || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                <span className="text-sm text-slate-400">Pending Commissions</span>
                <span className="font-bold text-amber-400">₹{summary?.pendingCommission || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                <span className="text-sm text-slate-400">Deals Closed</span>
                <span className="font-bold text-indigo-400">{summary?.wonDeals || 0}</span>
              </div>
            </div>
            
            <button onClick={() => router.push('/commissions')} className="w-full mt-2 py-2 border border-indigo-500/20 rounded-xl text-indigo-400 hover:bg-indigo-500/10 transition-colors text-sm font-medium">
              View Detailed Ledger
            </button>
          </motion.div>
        </div>

        {/* KYC Form */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-indigo-400" />
                KYC & Bank Details
              </h3>
              {(profile?.kycStatus === 'VERIFIED' || profile?.kycStatus === 'SUBMITTED' || profile?.kycStatus === 'FROZEN') && (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
            </div>

            {(profile?.kycStatus === 'VERIFIED' || profile?.kycStatus === 'SUBMITTED' || profile?.kycStatus === 'FROZEN') ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {profile?.kycStatus === 'VERIFIED' ? 'Your details are verified' : 
                     profile?.kycStatus === 'FROZEN' ? 'Account Frozen' : 'Verification in progress'}
                  </h4>
                  <p className="text-slate-400 text-sm max-w-sm mt-2">
                    {profile?.kycStatus === 'VERIFIED' ? 'Your KYC and bank details have been verified by the admin.' :
                     profile?.kycStatus === 'FROZEN' ? 'Please contact your administrator.' :
                     'Your details are currently being reviewed by the admin team.'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleKycSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Identity */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">Identity Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Country of Issue *</label>
                        <select 
                          required
                          value={kycForm.countryOfId}
                          onChange={e => setKycForm({...kycForm, countryOfId: e.target.value})}
                          className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                        >
                          <option value="">Select Country</option>
                          <option value="IN">India (PAN/Aadhaar)</option>
                          <option value="US">United States (SSN)</option>
                          <option value="UK">United Kingdom (NIN)</option>
                          <option value="AE">UAE (Emirates ID)</option>
                          <option value="AU">Australia (TFN)</option>
                          <option value="SG">Singapore (NRIC)</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">National ID Number *</label>
                        <input 
                          required
                          type="text" 
                          value={kycForm.nationalId}
                          onChange={e => setKycForm({...kycForm, nationalId: e.target.value.toUpperCase()})}
                          placeholder="ID Number"
                          className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 uppercase"
                        />
                      </div>
                    </div>
                    
                    {/* Document Upload */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-400 mb-1">Upload ID Document (PDF/Image) *</label>
                      <div className="mt-2 flex justify-center rounded-xl border border-dashed border-indigo-500/30 px-6 py-10 bg-slate-900/30 hover:bg-slate-900/50 transition-colors relative">
                        <div className="text-center">
                          {uploading ? (
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          ) : selectedFile ? (
                            <FileText className="mx-auto h-12 w-12 text-emerald-400 mb-4" />
                          ) : (
                            <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                          )}
                          <div className="mt-4 flex text-sm leading-6 justify-center">
                            <label className="relative cursor-pointer rounded-md bg-indigo-600/10 font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-1">
                              <span>{selectedFile ? 'Change file' : 'Upload a file'}</span>
                              <input type="file" className="sr-only" onChange={handleFileUpload} accept=".pdf,image/*" disabled={uploading} />
                            </label>
                          </div>
                          <p className="text-xs leading-5 text-slate-500 mt-2">
                            {selectedFile ? selectedFile.name : 'PDF, PNG, JPG up to 5MB'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banking */}
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2 mt-4">
                      <CreditCard className="w-4 h-4" /> Payout Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Bank Name *</label>
                        <input 
                          required
                          type="text" 
                          value={kycForm.bankName}
                          onChange={e => setKycForm({...kycForm, bankName: e.target.value})}
                          placeholder="e.g. HDFC Bank"
                          className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Account Number *</label>
                        <input 
                          required
                          type="text" 
                          value={kycForm.bankAccount}
                          onChange={e => setKycForm({...kycForm, bankAccount: e.target.value})}
                          placeholder="Account Number"
                          className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Routing / IFSC Code *</label>
                        <input 
                          required
                          type="text" 
                          value={kycForm.bankIfsc}
                          onChange={e => setKycForm({...kycForm, bankIfsc: e.target.value.toUpperCase()})}
                          placeholder="Code"
                          className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">UPI ID (India only)</label>
                        <input 
                          type="text" 
                          value={kycForm.upiId}
                          onChange={e => setKycForm({...kycForm, upiId: e.target.value})}
                          placeholder="username@upi"
                          className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/50 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmittingKyc || uploading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingKyc ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Submit Details
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Resignation Modal */}
      {showResignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-panel rounded-2xl border border-rose-500/20 overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-rose-500/10 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Submit Resignation
              </h3>
              <button onClick={() => setShowResignModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleResignSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Reason for leaving (Optional)</label>
                  <textarea 
                    rows={4}
                    value={resignReason}
                    onChange={e => setResignReason(e.target.value)}
                    placeholder="Please share why you are choosing to leave..."
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowResignModal(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmittingResignation}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmittingResignation ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
