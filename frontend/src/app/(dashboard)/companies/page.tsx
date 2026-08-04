/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Building2, Globe, MapPin, Users, DollarSign, X, Loader2, Trash2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Real Estate', 'Hospitality', 'Logistics', 'Media', 'Consulting', 'Legal', 'Other'];

export default function CompaniesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('SALES_MANAGER');
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', website: '', industry: '', employeeCount: '',
    annualRevenue: '', country: '', city: '', address: '', notes: ''
  });

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const { data: res } = await api.get('/companies?size=200');
      const list = res?.data?.content || res?.data || res?.content || res || [];
      setCompanies(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = companies;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.industry || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q) ||
        (c.country || '').toLowerCase().includes(q)
      );
    }
    if (filterIndustry) result = result.filter(c => c.industry === filterIndustry);
    return result;
  }, [companies, search, filterIndustry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Company name is required'); return; }
    setIsSubmitting(true);
    try {
      await api.post('/companies', {
        ...form,
        employeeCount: form.employeeCount ? parseInt(form.employeeCount) : null,
        annualRevenue: form.annualRevenue ? parseFloat(form.annualRevenue) : null
      });
      toast.success('Company created successfully!');
      setIsModalOpen(false);
      setForm({ name: '', website: '', industry: '', employeeCount: '', annualRevenue: '', country: '', city: '', address: '', notes: '' });
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this company? This cannot be undone.')) return;
    try {
      await api.delete(`/companies/${id}`);
      toast.success('Company deleted');
      setCompanies(companies.filter(c => c.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete company');
    }
    setActiveMenu(null);
  };

  const getIndustryColor = (industry: string) => {
    const map: Record<string, string> = {
      'Technology': 'text-indigo-400 bg-indigo-500/10',
      'Finance': 'text-emerald-400 bg-emerald-500/10',
      'Healthcare': 'text-cyan-400 bg-cyan-500/10',
      'Manufacturing': 'text-amber-400 bg-amber-500/10',
      'Retail': 'text-violet-400 bg-violet-500/10',
    };
    return map[industry] || 'text-slate-400 bg-slate-500/10';
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Companies</h2>
          <p className="text-slate-400 text-sm mt-1">Manage accounts and target organizations — {filtered.length} compan{filtered.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 outline-none"
          />
        </div>
        <select
          value={filterIndustry}
          onChange={e => setFilterIndustry(e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Industries</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      {/* Companies Grid */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 6}).map((_,i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 animate-pulse h-52" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-slate-400">
              {search || filterIndustry ? 'No companies match your filters' : 'No companies yet'}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {search || filterIndustry ? 'Try adjusting your filters' : 'Add your first company to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-panel rounded-2xl p-6 hover:border-indigo-500/30 transition-all group relative"
              >
                {/* Menu */}
                {isAdmin && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setActiveMenu(activeMenu === company.id ? null : company.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {activeMenu === company.id && (
                      <div className="absolute right-0 top-8 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                        <button onClick={() => handleDelete(company.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-sm truncate">{company.name}</h3>
                    {company.industry && (
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getIndustryColor(company.industry)}`}>
                        {company.industry}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {company.website && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="truncate hover:text-indigo-400 transition-colors">{company.website}</a>
                    </div>
                  )}
                  {(company.city || company.country) && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{[company.city, company.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {company.employeeCount && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>{company.employeeCount.toLocaleString()} employees</span>
                    </div>
                  )}
                  {company.annualRevenue && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <DollarSign className="w-3.5 h-3.5 shrink-0" />
                      <span>{formatCurrency(company.annualRevenue)} annual revenue</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Company Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f1a] border border-indigo-500/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-400" /> Add New Company</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Name *</label>
                    <input
                      required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Acme Corporation"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Industry</label>
                    <select
                      value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">— Select Industry —</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Website</label>
                    <input
                      value={form.website} onChange={e => setForm({...form, website: e.target.value})}
                      placeholder="https://acmecorp.com"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Employee Count</label>
                    <input
                      type="number" min="1" value={form.employeeCount} onChange={e => setForm({...form, employeeCount: e.target.value})}
                      placeholder="250"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Annual Revenue (₹)</label>
                    <input
                      type="number" min="0" value={form.annualRevenue} onChange={e => setForm({...form, annualRevenue: e.target.value})}
                      placeholder="10000000"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">City</label>
                    <input
                      value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                      placeholder="Mumbai"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Country</label>
                    <input
                      value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                      placeholder="India"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
                  <textarea
                    value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                    placeholder="Notes about this company..."
                    rows={3}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Company'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
