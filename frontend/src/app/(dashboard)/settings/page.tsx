'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Save, User, Building2, Bell, Shield, Paintbrush } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Paintbrush },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your account settings and preferences.</p>
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
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
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
        <div className="flex-1 glass-panel rounded-2xl p-6 min-h-[500px]">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-4">Profile Information</h3>
              
              <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-3">
                  <button onClick={(e) => { e.preventDefault(); toast.success('Avatar upload coming soon.') }} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl text-sm font-medium transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                  <input type="text" className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" defaultValue="Admin" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" defaultValue="User" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                  <input type="email" className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl px-4 py-2 text-slate-400 focus:ring-2 focus:ring-indigo-500/50 outline-none" defaultValue={user?.email} disabled />
                  <p className="text-xs text-slate-500 mt-2">Email changes require administrator approval.</p>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-700/50 pt-6 mt-6">
                <button onClick={(e) => { e.preventDefault(); toast.success('Settings save coming soon.') }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab !== 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-indigo-500/10 flex items-center justify-center mb-4">
                <Paintbrush className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
              <p className="text-slate-400 text-sm max-w-sm">This section is currently under development. Enterprise configurations will be available in the next update.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
