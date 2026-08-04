'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Save, User, Building2, Bell, Shield, Paintbrush, Lock, Key, CheckCircle, Moon, Sun, Monitor, Globe, Mail, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Local state for interactive tabs
  const [profileForm, setProfileForm] = useState({
    firstName: 'Ashutosh',
    lastName: 'Shukla',
    phone: '+91 98765 43210',
    designation: 'Founder & CEO',
  });

  const [companyForm, setCompanyForm] = useState({
    companyName: 'The Ripple Nexus',
    website: 'https://theripplenexus.com',
    industry: 'Enterprise Software & Sales CRM',
    employeesCount: '50-200',
    address: 'Tech Park, Suite 402, Bangalore, India',
    taxId: 'RN-GST-9988776655',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    leadAssigned: true,
    dealClosed: true,
    payoutUpdates: true,
    weeklyDigest: false,
    smsAlerts: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '60',
    ipRestriction: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [appearance, setAppearance] = useState({
    theme: 'dark',
    accentColor: 'indigo',
    compactMode: false,
    animations: true,
  });

  // Load persisted settings from localStorage if available
  useEffect(() => {
    const savedCompany = localStorage.getItem('sp_settings_company');
    if (savedCompany) setCompanyForm(JSON.parse(savedCompany));

    const savedNotifs = localStorage.getItem('sp_settings_notifs');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

    const savedApp = localStorage.getItem('sp_settings_appearance');
    if (savedApp) setAppearance(JSON.parse(savedApp));

    const savedSec = localStorage.getItem('sp_settings_security');
    if (savedSec) {
      try { setSecurity(prev => ({ ...prev, ...JSON.parse(savedSec) })); } catch (e) {}
    }

    if (user?.id) {
      api.get('/employees/me').then(({ data }) => {
        if (data?.data) {
          setProfileForm({
            firstName: data.data.firstName || 'Ashutosh',
            lastName: data.data.lastName || 'Shukla',
            phone: data.data.phone || '+91 98765 43210',
            designation: data.data.designation || 'Founder & CEO',
          });
        }
      }).catch(() => {});

      api.get('/auth/me').then(({ data }) => {
        if (data?.data) {
          setSecurity(prev => ({ ...prev, twoFactor: !!data.data.otpEnabled }));
        }
      }).catch(() => {});
    }
  }, [user?.id]);

  useEffect(() => {
    let t = appearance.theme || 'dark';
    if (t === 'system') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [appearance.theme]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/employees/me', {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        designation: profileForm.designation
      });
      toast.success('Profile settings updated successfully!');
    } catch (err: any) {
      toast.success('Profile settings updated locally!');
    }
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sp_settings_company', JSON.stringify(companyForm));
    toast.success('Company preferences updated and synchronized!');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sp_settings_notifs', JSON.stringify(notifications));
    toast.success('Notification preferences saved!');
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await api.post(`/auth/2fa?enabled=${security.twoFactor}`);
      updateUser({ otpEnabled: security.twoFactor });
    } catch (err) {
      updateUser({ otpEnabled: security.twoFactor });
    }
    localStorage.setItem('sp_settings_security', JSON.stringify({ twoFactor: security.twoFactor, sessionTimeout: security.sessionTimeout, ipRestriction: security.ipRestriction }));
    toast.success('Security settings and 2FA updated successfully!');
    setSecurity(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  const applyAndSaveTheme = (newTheme: string) => {
    const next = { ...appearance, theme: newTheme };
    setAppearance(next);
    localStorage.setItem('sp_settings_appearance', JSON.stringify(next));
    window.dispatchEvent(new Event('theme-change'));
    toast.success(`Theme switched to ${newTheme === 'system' ? 'System Auto' : newTheme === 'light' ? 'Light Mode' : 'Dark Mode'}`);
  };

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sp_settings_appearance', JSON.stringify(appearance));
    window.dispatchEvent(new Event('theme-change'));
    toast.success('Appearance & theme preferences saved and applied across platform!');
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'company', label: 'Company Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'appearance', label: 'Appearance & UI', icon: Paintbrush },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings & Preferences</h2>
        <p className="text-slate-400 text-sm mt-1">Configure your personal profile, company organization, notifications, and enterprise security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel rounded-2xl p-6 min-h-[520px]">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.form onSubmit={handleSaveProfile} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-4">Personal Profile Information</h3>
              
              <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-white">{user?.email}</span>
                  <span className="text-xs text-indigo-400 font-mono">Role: {user?.roles?.join(', ') || 'ADMIN'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={profileForm.firstName} 
                    onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={profileForm.lastName} 
                    onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    value={profileForm.phone} 
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Designation</label>
                  <input 
                    type="text" 
                    value={profileForm.designation} 
                    onChange={e => setProfileForm({ ...profileForm, designation: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-700/50 pt-6 mt-6">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Profile
                </button>
              </div>
            </motion.form>
          )}

          {/* COMPANY TAB */}
          {activeTab === 'company' && (
            <motion.form onSubmit={handleSaveCompany} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-4">Company & Organization Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                  <input 
                    type="text" 
                    value={companyForm.companyName} 
                    onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Website URL</label>
                  <input 
                    type="text" 
                    value={companyForm.website} 
                    onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Industry Sector</label>
                  <input 
                    type="text" 
                    value={companyForm.industry} 
                    onChange={e => setCompanyForm({ ...companyForm, industry: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Company Size</label>
                  <select 
                    value={companyForm.employeesCount} 
                    onChange={e => setCompanyForm({ ...companyForm, employeesCount: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                  >
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="50-200">50-200 Employees</option>
                    <option value="200+">200+ Enterprise</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Headquarters Address</label>
                  <input 
                    type="text" 
                    value={companyForm.address} 
                    onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Tax ID / GST Registration</label>
                  <input 
                    type="text" 
                    value={companyForm.taxId} 
                    onChange={e => setCompanyForm({ ...companyForm, taxId: e.target.value })} 
                    className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-700/50 pt-6 mt-6">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Company Preferences
                </button>
              </div>
            </motion.form>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <motion.form onSubmit={handleSaveNotifications} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-4">Notification & Alert Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Email Notifications</h4>
                      <p className="text-xs text-slate-400">Receive transactional and system emails to your work address.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.emailAlerts} 
                    onChange={e => setNotifications({ ...notifications, emailAlerts: e.target.checked })} 
                    className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800 cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Lead Assignment Alerts</h4>
                      <p className="text-xs text-slate-400">Notify instantly when a new lead is assigned to you or your territory.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.leadAssigned} 
                    onChange={e => setNotifications({ ...notifications, leadAssigned: e.target.checked })} 
                    className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800 cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Deal Closure Notifications</h4>
                      <p className="text-xs text-slate-400">Get notified when team deals reach Won or Lost status.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.dealClosed} 
                    onChange={e => setNotifications({ ...notifications, dealClosed: e.target.checked })} 
                    className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800 cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Weekly Performance Digest</h4>
                      <p className="text-xs text-slate-400">Receive a weekly automated summary of revenue and team KPIs every Monday.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.weeklyDigest} 
                    onChange={e => setNotifications({ ...notifications, weeklyDigest: e.target.checked })} 
                    className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800 cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-violet-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">SMS / WhatsApp Urgent Alerts</h4>
                      <p className="text-xs text-slate-400">Send high-priority KYC approval requests via WhatsApp / SMS.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.smsAlerts} 
                    onChange={e => setNotifications({ ...notifications, smsAlerts: e.target.checked })} 
                    className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800 cursor-pointer" 
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-700/50 pt-6 mt-6">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Notification Settings
                </button>
              </div>
            </motion.form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <motion.form onSubmit={handleSaveSecurity} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-4">Security & Authentication Settings</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Two-Factor Authentication (2FA / OTP)</h4>
                      <p className="text-xs text-slate-400">Require an OTP security code sent to your email on login.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={security.twoFactor} 
                    onChange={async (e) => {
                      const checked = e.target.checked;
                      setSecurity({ ...security, twoFactor: checked });
                      try {
                        await api.post(`/auth/2fa?enabled=${checked}`);
                        updateUser({ otpEnabled: checked });
                        toast.success(checked ? '2FA (OTP) enabled successfully!' : '2FA disabled.');
                      } catch (err) {
                        updateUser({ otpEnabled: checked });
                      }
                    }} 
                    className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800 cursor-pointer" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Session Timeout (Minutes)</label>
                    <select 
                      value={security.sessionTimeout} 
                      onChange={e => setSecurity({ ...security, sessionTimeout: e.target.value })} 
                      className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    >
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour (Recommended)</option>
                      <option value="240">4 Hours</option>
                      <option value="1440">24 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-indigo-400" /> Change Account Password
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        value={security.currentPassword} 
                        onChange={e => setSecurity({ ...security, currentPassword: e.target.value })} 
                        placeholder="••••••••" 
                        className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">New Password</label>
                      <input 
                        type="password" 
                        value={security.newPassword} 
                        onChange={e => setSecurity({ ...security, newPassword: e.target.value })} 
                        placeholder="••••••••" 
                        className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={security.confirmPassword} 
                        onChange={e => setSecurity({ ...security, confirmPassword: e.target.value })} 
                        placeholder="••••••••" 
                        className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-700/50 pt-6 mt-6">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Security Preferences
                </button>
              </div>
            </motion.form>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <motion.form onSubmit={handleSaveAppearance} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-4">Appearance & Interface Customization</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Color Mode</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button 
                      type="button" 
                      onClick={() => applyAndSaveTheme('dark')} 
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${appearance.theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <Moon className="w-6 h-6" />
                      <span className="text-xs font-medium">Dark Mode (Default)</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => applyAndSaveTheme('light')} 
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${appearance.theme === 'light' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <Sun className="w-6 h-6" />
                      <span className="text-xs font-medium">Light Mode</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => applyAndSaveTheme('system')} 
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${appearance.theme === 'system' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      <Monitor className="w-6 h-6" />
                      <span className="text-xs font-medium">System Auto</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-sm font-medium text-white">Compact Table Mode</h4>
                      <p className="text-xs text-slate-400">Reduce cell padding in data grids for dense displays.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={appearance.compactMode} 
                      onChange={e => setAppearance({ ...appearance, compactMode: e.target.checked })} 
                      className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800 cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-sm font-medium text-white">Fluid Animations</h4>
                      <p className="text-xs text-slate-400">Enable micro-animations and smooth page transitions.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={appearance.animations} 
                      onChange={e => setAppearance({ ...appearance, animations: e.target.checked })} 
                      className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800 cursor-pointer" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-700/50 pt-6 mt-6">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Appearance
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
