/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building2, Mail, Phone, MapPin, DollarSign, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('info');
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const { data } = await api.get(`/leads/${id}`);
      setLead(data);
    } catch (err) {
      console.error('Failed to fetch lead details', err);
      router.push('/leads');
    } finally {
      setLoading(false);
    }
  };

  const timeline = [
    { id: 1, type: 'status', title: 'Lead Created', desc: 'Added to the system.', date: lead ? format(new Date(lead.createdAt), 'MMM dd, yyyy') : '', icon: CheckCircle2 },
  ];

  if (loading || !lead) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col max-w-6xl mx-auto">
      {/* Header Profile */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-2xl font-bold text-white">
            {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{lead.firstName} {lead.lastName}</h2>
            <div className="flex items-center gap-3 mt-2 text-slate-300">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-indigo-400" /> {lead.company?.name || 'Unknown Company'}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>{lead.jobTitle || 'No Title'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <button onClick={() => toast.success('Convert to deal flow coming soon.')} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
            Convert to Deal
          </button>
          <button onClick={() => toast.success('Log Activity coming soon.')} className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl text-sm font-medium border border-slate-700 transition-all">
            Log Activity
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* Left Column (Info) */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="glass-panel p-1.5 rounded-2xl flex gap-1">
            {['info', 'files'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all capitalize ${activeTab === tab ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-white mb-4">Lead Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center"><Mail className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-medium text-white">{lead.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center"><Phone className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-sm font-medium text-white">{lead.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center"><MapPin className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-sm font-medium text-white">{lead.city || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><DollarSign className="w-4 h-4 text-emerald-400" /></div>
                    <div>
                      <p className="text-xs text-slate-500">Est. Value</p>
                      <p className="text-sm font-bold text-emerald-400">{lead.dealValue ? formatCurrency(lead.dealValue) : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">Status</p>
                    <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-medium">
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">Source</p>
                    <p className="text-sm text-white">{lead.source || 'Manual'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'files' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-700">
                <FileText className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm font-medium mb-1">No files attached</p>
                <p className="text-slate-500 text-xs mb-4">Upload contracts or proposals</p>
                <button onClick={() => toast.success('File upload coming soon.')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm transition-colors">
                  Upload File
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column (Timeline) */}
        <div className="flex-1 glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Activity Timeline
          </h3>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {timeline.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-900 group-[.is-active]:bg-indigo-500/20 group-[.is-active]:border-indigo-500/30 text-slate-500 group-[.is-active]:text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl glass-panel bg-slate-900/50 hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm text-white">{item.title}</h4>
                      <time className="text-xs font-medium text-slate-500">{item.date}</time>
                    </div>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
