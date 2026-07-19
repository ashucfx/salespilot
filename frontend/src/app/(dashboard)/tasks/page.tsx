/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckSquare, Calendar, Filter, Clock, MoreVertical, Search, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Assuming tasks are a subset of activities or a dedicated endpoint. 
      // For now, mapping to an expected /tasks or /activities?type=TASK endpoint.
      const { data } = await api.get('/activities');
      // Filter only tasks if the backend returns all activities
      const taskList = data.filter((item: any) => item.activityType === 'TASK' || item.type === 'TASK' || !item.activityType);
      setTasks(taskList);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (!priority) return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    switch (priority.toUpperCase()) {
      case 'HIGH': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    return <div className="w-5 h-5 rounded-md border-2 border-slate-600 group-hover:border-indigo-400 transition-colors" />;
  };

  return (
    <div className="space-y-6 h-full flex flex-col max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            Tasks
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage your daily to-dos and follow-ups.</p>
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
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
            className="w-full bg-slate-900/50 border border-indigo-500/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="px-4 py-2 bg-slate-800/50 hover:bg-indigo-500/20 hover:text-indigo-300 text-slate-300 border border-indigo-500/10 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Task List */}
      <div className="glass-panel rounded-3xl overflow-hidden flex-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 p-12 flex-col gap-3">
            <CheckSquare className="w-12 h-12 text-slate-600" />
            <p>No tasks found. You are all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 hover:bg-slate-800/30 transition-colors group flex items-start sm:items-center gap-4 ${task.status === 'COMPLETED' ? 'opacity-60' : ''}`}
              >
                <button onClick={() => toast.success('Task completion sync coming soon.')} className="mt-1 sm:mt-0 shrink-0">
                  {getStatusIcon(task.status)}
                </button>
                
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate transition-colors ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-white group-hover:text-indigo-300'}`}>
                      {task.title || task.subject || 'Untitled Task'}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                      {task.relatedTo && (
                        <span className="truncate">{task.relatedTo}</span>
                      )}
                      {task.relatedTo && <span className="w-1 h-1 rounded-full bg-slate-700" />}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate || task.activityDate ? format(new Date(task.dueDate || task.activityDate), 'MMM d, yyyy') : 'No Date'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                      {task.priority || 'NORMAL'}
                    </span>
                    <button onClick={() => toast.success('Options menu coming soon.')} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
