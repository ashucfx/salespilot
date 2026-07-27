'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, DollarSign, Target, Briefcase, Mail, Filter, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      const list = res.data?.data?.content || res.data?.data || res.data?.content || res.data || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback to empty list if API fails
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true, read: true })));
      toast.success('All notifications marked as read');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (error) {
      setNotifications([]);
      toast.success('All notifications cleared');
    }
  };

  const deleteSingle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Notification removed');
    } catch (error) {
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Notification removed');
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
    } catch (error) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
    }
  };

  const getIcon = (type: string = '') => {
    const t = type.toLowerCase();
    if (t.includes('deal')) return <Briefcase className="w-5 h-5 text-emerald-400" />;
    if (t.includes('commission') || t.includes('payout')) return <DollarSign className="w-5 h-5 text-emerald-400" />;
    if (t.includes('target')) return <Target className="w-5 h-5 text-indigo-400" />;
    if (t.includes('lead')) return <Mail className="w-5 h-5 text-blue-400" />;
    if (t.includes('meeting') || t.includes('call')) return <Bell className="w-5 h-5 text-orange-400" />;
    return <Bell className="w-5 h-5 text-slate-400" />;
  };

  const getIconBg = (type: string = '') => {
    const t = type.toLowerCase();
    if (t.includes('deal')) return 'bg-emerald-500/10 border-emerald-500/20';
    if (t.includes('commission') || t.includes('payout')) return 'bg-emerald-500/10 border-emerald-500/20';
    if (t.includes('target')) return 'bg-indigo-500/10 border-indigo-500/20';
    if (t.includes('lead')) return 'bg-blue-500/10 border-blue-500/20';
    if (t.includes('meeting') || t.includes('call')) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-slate-500/10 border-slate-500/20';
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return 'Just now';
    try {
      const date = new Date(timeStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeStr;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

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
            disabled={notifications.length === 0 || unreadCount === 0}
            className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 disabled:opacity-50 text-white border border-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark All Read
          </button>
          <button 
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification, i) => {
                const isNotificationRead = notification.isRead || notification.read;
                return (
                  <motion.div 
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-4 rounded-xl flex gap-4 items-start group cursor-pointer transition-all ${
                      isNotificationRead ? 'bg-transparent hover:bg-slate-800/30' : 'bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10'
                    }`}
                    onClick={() => markSingleRead(notification.id)}
                  >
                    <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${getIconBg(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-semibold truncate ${isNotificationRead ? 'text-slate-300' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                          {formatTime(notification.createdAt || notification.time)}
                        </span>
                      </div>
                      <p className={`text-sm ${isNotificationRead ? 'text-slate-400' : 'text-slate-300'}`}>
                        {notification.message}
                      </p>
                    </div>
                    
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-700/50 rounded-lg text-slate-500 hover:text-red-400 transition-all shrink-0"
                      onClick={(e) => deleteSingle(notification.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
          {!loading && notifications.length === 0 && (
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
