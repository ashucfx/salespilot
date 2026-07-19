/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Mail, Phone, Building2, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/contacts');
      setContacts(data);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Contacts</h2>
          <p className="text-slate-400 text-sm mt-1">Manage people and stakeholders.</p>
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contacts by name or role..."
            className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="px-4 py-2 bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-300 border border-indigo-500/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No contacts found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-6 rounded-3xl hover:bg-slate-800/50 transition-all cursor-pointer group relative"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toast.success('Options menu coming soon.')} className="p-2 text-slate-400 hover:text-white bg-slate-900/80 rounded-xl backdrop-blur-sm transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-400">
                  {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <p className="text-sm text-slate-400 mt-0.5">{contact.jobTitle || 'No Title'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="truncate">{contact.company?.name || 'No Company'}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="truncate">{contact.email || 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="truncate">{contact.phone || 'N/A'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
