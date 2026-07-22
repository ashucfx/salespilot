'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  User, ShieldAlert, CheckCircle2, Briefcase, Activity, 
  CreditCard, Save, Lock, Upload, FileText, Camera, Trophy, 
  Sparkles, Award, Phone, Mail, MapPin, Building, Calendar, Edit3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'incentives' | 'kyc' | 'security'>('overview');
  
  // Profile edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Avatar State
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
  const [uploadingKycDoc, setUploadingKycDoc] = useState(false);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

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
      setLoading(true);
      const { data } = await api.get('/employees/me');
      const empData = data.data;
      setProfile(empData);
      
      // Update local store avatar if updated
      if (empData.profilePicture) {
        updateUser({ profilePicture: empData.profilePicture });
      }

      setEditForm({
        firstName: empData.firstName || '',
        lastName: empData.lastName || '',
        phone: empData.phone || '',
        whatsapp: empData.whatsapp || '',
        address: empData.address || '',
        city: empData.city || '',
        state: empData.state || '',
        country: empData.country || '',
        pincode: empData.pincode || '',
        emergencyName: empData.emergencyName || '',
        emergencyPhone: empData.emergencyPhone || '',
        emergencyRelation: empData.emergencyRelation || ''
      });

      setKycForm({
        countryOfId: empData.countryOfId || '',
        nationalId: empData.nationalId || '',
        kycDocumentPath: empData.kycDocumentPath || '',
        upiId: empData.upiId || '',
        bankName: empData.bankName || '',
        bankAccount: empData.bankAccount || '',
        bankIfsc: empData.bankIfsc || ''
      });

      // Also fetch analytics summary
      const statsRes = await api.get('/analytics/me');
      setSummary(statsRes.data.data);
    } catch (err) {
      console.error('Failed to load profile', err);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar image must be smaller than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'avatars');

    try {
      setUploadingAvatar(true);
      const { data: uploadData } = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const avatarUrl = uploadData.data;

      // Save avatar to employee profile
      await api.post('/employees/me/avatar', { avatarUrl });
      
      setProfile((prev: any) => ({ ...prev, profilePicture: avatarUrl }));
      updateUser({ profilePicture: avatarUrl });
      toast.success('Avatar updated successfully!');
    } catch (err) {
      console.error('Failed to upload avatar', err);
      toast.error('Failed to upload avatar image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await api.put('/employees/me', editForm);
      toast.success('Profile details updated successfully!');
      setIsEditing(false);
      fetchProfileData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleKycDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Document size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'kyc-documents');

    try {
      setUploadingKycDoc(true);
      const { data } = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setKycForm(prev => ({ ...prev, kycDocumentPath: data.data }));
      toast.success('KYC document uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload document');
    } finally {
      setUploadingKycDoc(false);
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
      toast.success('KYC details submitted successfully!');
      fetchProfileData();
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

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <span className="text-emerald-400 font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Fully Verified</span>;
      case 'PENDING': return <span className="text-slate-400 font-semibold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Action Required</span>;
      case 'SUBMITTED': return <span className="text-amber-400 font-semibold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Under Review</span>;
      case 'CLARIFICATION_NEEDED': return <span className="text-orange-400 font-semibold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Clarification Needed</span>;
      case 'FROZEN': return <span className="text-red-400 font-semibold flex items-center gap-1.5"><Lock className="w-4 h-4" /> Account Frozen</span>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/20 p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Upload Container */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border-2 border-indigo-500/30 shadow-xl flex items-center justify-center text-3xl font-extrabold text-indigo-400">
              {profile?.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt={profile.fullName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.firstName?.charAt(0).toUpperCase() || 'U'
              )}
            </div>

            {/* Upload Overlay Button */}
            <label className="absolute inset-0 bg-slate-950/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera className="w-7 h-7 text-white" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
                disabled={uploadingAvatar}
              />
            </label>
          </div>

          {/* User Meta */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{profile?.fullName}</h1>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                {user?.roles?.[0] || 'EMPLOYEE'}
              </span>
            </div>

            <p className="text-slate-400 text-sm flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-indigo-400" /> {profile?.designation || 'Sales Agent'}</span>
              <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-violet-400" /> {profile?.department || 'Sales & Operations'}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Joined {profile?.joiningDate || 'N/A'}</span>
            </p>
          </div>

          {/* Sales Tier Badge */}
          <div className="glass-panel px-5 py-4 rounded-2xl border border-indigo-500/20 text-center">
            <p className="text-xs text-slate-400">Employee ID</p>
            <p className="text-base font-extrabold text-white">{profile?.employeeNumber}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Gold Representative
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'overview' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4" /> Personal Details
        </button>

        <button
          onClick={() => setActiveTab('incentives')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'incentives' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Trophy className="w-4 h-4" /> Incentive & Performance
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'kyc' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <CreditCard className="w-4 h-4" /> KYC & Bank Info
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'security' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-4 h-4" /> Account & Security
        </button>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Personal Information
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel Edit' : 'Edit Information'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">WhatsApp Number</label>
                  <input
                    type="text"
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-slate-400">Residential Address</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400">Country</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> Work Email</span>
                <p className="text-sm font-semibold text-white">{profile?.workEmail}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> Phone Number</span>
                <p className="text-sm font-semibold text-white">{profile?.phone || 'Not provided'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Location / City</span>
                <p className="text-sm font-semibold text-white">{profile?.city ? `${profile.city}, ${profile.country || ''}` : 'Not provided'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 space-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Manager</span>
                <p className="text-sm font-semibold text-white">{profile?.managerName || 'Direct Founder'}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Tab 2: Incentives & Performance */}
      {activeTab === 'incentives' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl space-y-2 border border-emerald-500/20">
              <span className="text-xs text-slate-400">Total Paid Commissions</span>
              <p className="text-2xl font-extrabold text-emerald-400">₹{summary?.paidCommission?.toLocaleString() || 0}</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-2 border border-amber-500/20">
              <span className="text-xs text-slate-400">Pending Commissions</span>
              <p className="text-2xl font-extrabold text-amber-400">₹{summary?.pendingCommission?.toLocaleString() || 0}</p>
            </div>

            <div className="glass-panel p-6 rounded-3xl space-y-2 border border-indigo-500/20">
              <span className="text-xs text-slate-400">Total Won Deals</span>
              <p className="text-2xl font-extrabold text-indigo-400">{summary?.wonDeals || 0}</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Incentive Milestones
              </h3>
              <button onClick={() => router.push('/incentives')} className="text-xs font-semibold text-indigo-400 hover:underline">
                Open Incentives Hub →
              </button>
            </div>
            <p className="text-xs text-slate-400">Track and claim your performance bonuses from the Incentives Hub.</p>
          </div>
        </motion.div>
      )}

      {/* Tab 3: KYC & Bank Info */}
      {activeTab === 'kyc' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              KYC & Payout Details
            </h3>
            {getKycBadge(profile?.kycStatus)}
          </div>

          <form onSubmit={handleKycSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400">National ID / Passport Number</label>
                <input
                  type="text"
                  value={kycForm.nationalId}
                  onChange={(e) => setKycForm({ ...kycForm, nationalId: e.target.value })}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">Bank Name</label>
                <input
                  type="text"
                  value={kycForm.bankName}
                  onChange={(e) => setKycForm({ ...kycForm, bankName: e.target.value })}
                  placeholder="e.g. HDFC Bank"
                  className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">Bank Account Number</label>
                <input
                  type="text"
                  value={kycForm.bankAccount}
                  onChange={(e) => setKycForm({ ...kycForm, bankAccount: e.target.value })}
                  placeholder="Account Number"
                  className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400">UPI ID for Quick Payouts</label>
                <input
                  type="text"
                  value={kycForm.upiId}
                  onChange={(e) => setKycForm({ ...kycForm, upiId: e.target.value })}
                  placeholder="username@upi"
                  className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-medium text-slate-400">Upload Identity / KYC Document (PDF or Image)</label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleKycDocUpload}
                    className="hidden"
                    id="kyc-doc-upload"
                  />
                  <label
                    htmlFor="kyc-doc-upload"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-300 text-xs font-semibold cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-indigo-400" />
                    {uploadingKycDoc ? 'Uploading...' : 'Choose Document File'}
                  </label>
                  {kycForm.kycDocumentPath && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Document Uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingKyc}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {isSubmittingKyc ? 'Submitting...' : 'Submit KYC & Bank Details'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Tab 4: Security & Resignation */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" /> Account & Security
          </h3>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Password & OTP Security</p>
                <p className="text-xs text-slate-400 mt-0.5">Your account uses dual-factor authentication and OTP validation.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-rose-300">Employment Resignation</p>
                <p className="text-xs text-slate-400 mt-0.5">Submit formal resignation to initiating exit workflows.</p>
              </div>
              <button
                onClick={() => setShowResignModal(true)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-colors"
              >
                Submit Resignation
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
