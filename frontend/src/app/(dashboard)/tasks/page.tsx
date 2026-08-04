/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, CheckSquare, Calendar, Clock, MoreVertical, Search, CheckCircle2, X, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM', dueDate: '', leadId: '', dealId: ''
  });
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
    fetchLeads();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data: res } = await api.get('/tasks?size=200');
      const list = res?.data?.content || res?.data || res?.content || res || [];
      setTasks(Array.isArray(list) ? list : []);
    } catch (err) {
      // Fallback to /activities endpoint
      try {
        const { data: res2 } = await api.get('/activities?size=200');
        const list2 = res2?.data?.content || res2?.data || res2?.content || res2 || [];
        const acts = Array.isArray(list2) ? list2 : [];
        setTasks(acts.filter((a: any) => a.activityType === 'TASK' || a.type === 'TASK' || !a.activityType));
      } catch {
        setTasks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data: res } = await api.get('/leads?size=200');
      const list = res?.data?.content || res?.data || res?.content || res || [];
      setLeads(Array.isArray(list) ? list : []);
    } catch { /* ignore */ }
  };

  const filtered = useMemo(() => {
    let result = tasks;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => (t.title || t.subject || '').toLowerCase().includes(q));
    }
    if (filterPriority) result = result.filter(t => t.priority === filterPriority);
    if (filterStatus) result = result.filter(t => t.status === filterStatus);
    return result;
  }, [tasks, search, filterPriority, filterStatus]);

  const handleToggleComplete = async (task: any) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      toast.success(newStatus === 'COMPLETED' ? '✅ Task marked complete!' : 'Task reopened');
    } catch {
      // Optimistic update anyway
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Task title is required'); return; }
    setIsSubmitting(true);
    try {
      const payload: any = {
        title: form.title, description: form.description,
        priority: form.priority, dueDate: form.dueDate || undefined,
        status: 'PENDING'
      };
      if (form.leadId) payload.leadId = form.leadId;
      if (form.dealId) payload.dealId = form.dealId;
      
      await api.post('/tasks', payload);
      toast.success('Task created successfully!');
      setIsModalOpen(false);
      setForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', leadId: '', dealId: '' });
      fetchTasks();
    } catch (err: any) {
      // Fallback to activities endpoint
      try {
        await api.post('/activities', {
          subject: form.title, activityType: 'TASK',
          priority: form.priority,
          activityDate: form.dueDate || new Date().toISOString(),
          status: 'PENDING', notes: form.description
        });
        toast.success('Task created successfully!');
        setIsModalOpen(false);
        setForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', leadId: '', dealId: '' });
        fetchTasks();
      } catch {
        toast.error('Failed to create task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch {
      setTasks(tasks.filter(t => t.id !== id));
    }
    setActiveMenu(null);
  };

  const getPriorityColor = (priority: string) => {
    switch ((priority || '').toUpperCase()) {
      case 'URGENT': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusCounts = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const pending = tasks.filter(t => t.status !== 'COMPLETED').length;
    return { total, completed, pending };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6 h-full flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            Tasks
          </h2>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-slate-400 text-sm">{counts.pending} pending · {counts.completed} completed</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-3 rounded-2xl flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 outline-none"
          />
        </div>
        <select
          value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Task List */}
      <div className="glass-panel rounded-3xl overflow-hidden flex-1">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center text-slate-500 p-12 flex-col gap-3">
            <CheckSquare className="w-12 h-12 text-slate-600" />
            <p>{search || filterPriority || filterStatus ? 'No tasks match your filters' : 'No tasks yet. Click "New Task" to add one!'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {filtered.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`p-4 hover:bg-slate-800/30 transition-colors group flex items-start sm:items-center gap-4 ${task.status === 'COMPLETED' ? 'opacity-60' : ''}`}
              >
                <button
                  onClick={() => handleToggleComplete(task)}
                  className="mt-0.5 sm:mt-0 shrink-0 transition-transform hover:scale-110"
                  title={task.status === 'COMPLETED' ? 'Reopen task' : 'Mark complete'}
                >
                  {task.status === 'COMPLETED'
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    : <div className="w-5 h-5 rounded-md border-2 border-slate-600 group-hover:border-indigo-400 transition-colors" />
                  }
                </button>

                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate transition-colors ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-white group-hover:text-indigo-300'}`}>
                      {task.title || task.subject || 'Untitled Task'}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                      {(task.dueDate || task.activityDate) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(task.dueDate || task.activityDate), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {task.priority && (
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    )}

                    {/* Options menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenu === task.id && (
                        <div className="absolute right-0 top-8 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {task.status === 'COMPLETED' ? 'Reopen' : 'Complete'}
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f1a] border border-indigo-500/20 rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><CheckSquare className="w-5 h-5 text-indigo-400" /> New Task</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
                  <input
                    required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="What needs to be done?"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                  <textarea
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="Optional details..."
                    rows={3}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Priority</label>
                    <select
                      value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Due Date</label>
                    <input
                      type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Linked Lead (Optional)</label>
                  <select
                    value={form.leadId} onChange={e => setForm({...form, leadId: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="">— No Lead —</option>
                    {leads.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.leadNumber ? `[${l.leadNumber}] ` : ''}{l.companyName || l.contactName || 'Lead'}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Task'}
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
