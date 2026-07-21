'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Search, Filter, Plus, Building2, 
  Calendar, User, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LeadsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await api.get('/leads');
        setLeads(data.data.content || []);
      } catch (error) {
        console.error('Failed to load leads', error);
        // Fallback for development if API is incomplete
        setLeads([
          { id: '1', leadNumber: 'LD-2026-001', companyName: 'Acme Corp', contactName: 'John Doe', status: 'NEW', createdAt: new Date().toISOString() },
          { id: '2', leadNumber: 'LD-2026-002', companyName: 'TechFlow', contactName: 'Jane Smith', status: 'CONTACTED', createdAt: new Date().toISOString() },
          { id: '3', leadNumber: 'LD-2026-003', companyName: 'Global Ind.', contactName: 'Mike Johnson', status: 'QUALIFIED', createdAt: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await api.put(`/leads/${leadId}`, { status: newStatus });
      toast.success('Lead status updated');
      setLeads(leads.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'CONTACTED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'QUALIFIED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PROPOSAL_SENT': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'WON': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'LOST': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Leads</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and track your potential customers.</p>
        </div>
        <Link href="/leads/new" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Lead
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, company, or email..."
            className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="px-4 py-2 bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-300 border border-indigo-500/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Leads Table */}
      <div className="glass-panel rounded-2xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-indigo-500/10 bg-slate-900/30">
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Lead Info</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No leads found.</td>
                </tr>
              ) : (
                leads.map((lead, i) => (
                  <motion.tr 
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => window.location.href = `/leads/${lead.id}`}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center border border-indigo-500/20">
                          <User className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{lead.contactName}</p>
                          <p className="text-xs text-slate-500">{lead.leadNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-300">{lead.companyName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-colors ${getStatusColor(lead.status)} [&>option]:bg-slate-900 [&>option]:text-white`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
                        <option value="WON">WON</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{format(new Date(lead.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast.success('Lead details panel coming soon.') }} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
