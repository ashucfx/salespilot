'use client';

import { useState } from 'react';
import { Bell, CheckCircle2, DollarSign, Target, Briefcase, Mail, Filter, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Deal Closed Won!', message: 'Acme Corp has signed the enterprise agreement. Revenue: $150,000.', time: '10 mins ago', type: 'deal', read: false },
    { id: '2', title: 'Commission Approved', message: 'Your commission of $4,500 for the TechFlow deal has been approved.', time: '2 hours ago', type: 'commission', read: false },
    { id: '3', title: 'Target Achieved', message: 'Congratulations! You have reached your Q3 Revenue Target.', time: 'Yesterday', type: 'target', read: true },
    { id: '4', title: 'New Lead Assigned', message: 'A new high-priority lead from Stark Industries has been assigned to you.', time: 'Yesterday', type: 'lead', read: true },
    { id: '5', title: 'Meeting Reminder', message: 'Discovery call with Global Ind. in 30 minutes.', time: 'Aug 10', type: 'meeting', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'deal': return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'commission': return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'target': return <Target className="w-5 h-5 text-indigo-400" />;
      case 'lead': return <Mail className="w-5 h-5 text-blue-400" />;
      case 'meeting': return <Bell className="w-5 h-5 text-orange-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'deal': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'commission': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'target': return 'bg-indigo-500/10 border-indigo-500/20';
      case 'lead': return 'bg-blue-500/10 border-blue-500/20';
      case 'meeting': return 'bg-orange-500/10 border-orange-500/20';
      default: return 'bg-slate-500/10 border-slate-500/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h2>
          <p className="text-slate-400 text-sm mt-1">Stay updated on your sales activity and alerts.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllRead}
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark All Read
          </button>
          <button 
            onClick={() => toast.success('Filters coming soon')}
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <AnimatePresence>
            {notifications.map((notification, i) => (
              <motion.div 
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl flex gap-4 items-start group cursor-pointer transition-all ${
                  notification.read ? 'bg-transparent hover:bg-slate-800/30' : 'bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10'
                }`}
                onClick={() => {
                  setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
                }}
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${getIconBg(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold truncate ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-sm ${notification.read ? 'text-slate-400' : 'text-slate-300'}`}>
                    {notification.message}
                  </p>
                </div>
                
                <button 
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-700/50 rounded-lg text-slate-500 hover:text-red-400 transition-all shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifications(notifications.filter(n => n.id !== notification.id));
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Bell className="w-8 h-8 mb-2 opacity-50" />
              <p>No notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
