'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, Mail, Phone, Target, DollarSign, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/leads');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create New Lead</h2>
        <p className="text-slate-400 text-sm mt-1">Add a new prospect to your sales pipeline.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Contact Information */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Contact Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">First Name *</label>
              <input required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Last Name *</label>
              <input required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input required type="email" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="john@company.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="tel" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Company Information */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Company Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Company Name *</label>
              <input required type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="Acme Corp" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Job Title</label>
              <input type="text" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="VP of Sales" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Industry</label>
              <select className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none">
                <option value="">Select Industry</option>
                <option value="software">Software / IT</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="manufacturing">Manufacturing</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Lead Qualifications */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Lead Qualification</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Estimated Value</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                <input type="number" className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="50000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Lead Source</label>
              <select className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none">
                <option value="website">Website Form</option>
                <option value="referral">Referral</option>
                <option value="outbound">Outbound</option>
                <option value="event">Event / Conference</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Notes</label>
              <textarea rows={4} className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none" placeholder="Add any background context about this lead..."></textarea>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
}
