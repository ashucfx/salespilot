/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Mail, Phone, Building2, MoreHorizontal, X, Loader2, User, MapPin, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function ContactsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('SALES_MANAGER');
  const [contacts, setContacts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    designation: '', companyId: '', city: '', country: '',
    linkedinUrl: '', whatsapp: '', isDecisionMaker: false, notes: ''
  });

  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data: res } = await api.get('/contacts?size=200');
      const list = res?.data?.content || res?.data || res?.content || res || [];
      setContacts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data: res } = await api.get('/companies?size=200');
      const list = res?.data?.content || res?.data || res?.content || res || [];
      setCompanies(Array.isArray(list) ? list : []);
    } catch (err) { /* silently fail */ }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return contacts;
    return contacts.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.designation || '').toLowerCase().includes(q) ||
      (c.company?.name || '').toLowerCase().includes(q)
    );
  }, [contacts, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim()) { toast.error('First name is required'); return; }
    setIsSubmitting(true);
    try {
      const payload: any = { ...form };
      if (form.companyId) {
        payload.company = { id: form.companyId };
      }
      delete payload.companyId;
      await api.post('/contacts', payload);
      toast.success('Contact created successfully!');
      setIsModalOpen(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', designation: '', companyId: '', city: '', country: '', linkedinUrl: '', whatsapp: '', isDecisionMaker: false, notes: '' });
      fetchContacts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact? This cannot be undone.')) return;
    try {
      await api.delete(`/contacts/${id}`);
      toast.success('Contact deleted');
      setContacts(contacts.filter(c => c.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete contact');
    }
    setActiveMenu(null);
  };

  const getInitials = (c: any) => `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase() || 'C';
  const colors = ['bg-indigo-500/20 text-indigo-400','bg-violet-500/20 text-violet-400','bg-cyan-500/20 text-cyan-400','bg-emerald-500/20 text-emerald-400','bg-amber-500/20 text-amber-400'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Contacts</h2>
          <p className="text-slate-400 text-sm mt-1">Manage people and stakeholders — {filtered.length} contact{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-foreground px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Search */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts by name, email, role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 outline-none"
          />
        </div>
        <span className="text-xs text-slate-500">{filtered.length} of {contacts.length}</span>
      </div>

      {/* Contact Cards */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({length: 8}).map((_,i) => (
              <div key={i} className="glass-panel rounded-2xl p-5 animate-pulse h-44" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <User className="w-12 h-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-slate-400">
              {search ? 'No contacts match your search' : 'No contacts yet'}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {search ? 'Try a different search term' : 'Add your first contact to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-panel rounded-2xl p-5 hover:border-indigo-500/30 transition-all group relative"
              >
                {/* Menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setActiveMenu(activeMenu === contact.id ? null : contact.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-all"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {activeMenu === contact.id && (
                    <div className="absolute right-0 top-8 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                      {isAdmin && (
                        <button onClick={() => handleDelete(contact.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center text-center mb-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-3 ${colors[i % colors.length]}`}>
                    {getInitials(contact)}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.designation && (
                    <p className="text-xs text-indigo-400 mt-0.5">{contact.designation}</p>
                  )}
                  {contact.isDecisionMaker && (
                    <span className="mt-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Decision Maker</span>
                  )}
                </div>

                <div className="space-y-1.5 text-left">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.company?.name && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{contact.company.name}</span>
                    </div>
                  )}
                  {(contact.city || contact.country) && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{[contact.city, contact.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Contact Modal */}
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
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-indigo-400" /> Add New Contact</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">First Name *</label>
                    <input
                      required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                      placeholder="John"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Last Name</label>
                    <input
                      value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                      placeholder="Doe"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                    <input
                      type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="john@company.com"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                    <input
                      value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Designation / Role</label>
                    <input
                      value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}
                      placeholder="VP of Sales"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Company</label>
                    <select
                      value={form.companyId} onChange={e => setForm({...form, companyId: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">— Select Company —</option>
                      {companies.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">City</label>
                    <input
                      value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                      placeholder="Mumbai"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Country</label>
                    <input
                      value={form.country} onChange={e => setForm({...form, country: e.target.value})}
                      placeholder="India"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">LinkedIn URL</label>
                    <input
                      value={form.linkedinUrl} onChange={e => setForm({...form, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/in/johndoe"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">WhatsApp</label>
                    <input
                      value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
                  <textarea
                    value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                    placeholder="Additional notes about this contact..."
                    rows={3}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox" id="dm" checked={form.isDecisionMaker}
                    onChange={e => setForm({...form, isDecisionMaker: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-800"
                  />
                  <label htmlFor="dm" className="text-sm text-slate-300 cursor-pointer">This person is a decision maker</label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-foreground text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Contact'}
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
