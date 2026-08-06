'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Menu, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?size=10');
      const list = res.data?.data?.content || res.data?.data || res.data?.content || res.data || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback to empty list if API fails
      setNotifications([]);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true, read: true })));
    } catch (error) {
      setNotifications(notifications.map(n => ({ ...n, isRead: true, read: true })));
    }
  };

  const clearAll = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
    } catch (error) {
      setNotifications([]);
    }
  };

  const deleteSingle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      setNotifications(notifications.filter(n => n.id !== id));
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

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;
  
  // Format pathname into a readable title
  const getPageTitle = () => {
    const path = pathname.split('/')[1] || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
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

  return (
    <header className="h-16 shrink-0 border-b border-indigo-500/10 bg-[#0f0f1a]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="text-base font-bold text-foreground tracking-tight hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden md:block w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search leads, deals..." 
              className="w-full bg-[#1a1a2e]/60 border border-indigo-500/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white bg-[#1a1a2e]/60 border border-indigo-500/10 rounded-full transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0f0f1a]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] border border-indigo-500/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-indigo-500/10 flex justify-between items-center bg-slate-900/50">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAll}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((notif) => {
                        const isNotifRead = notif.isRead || notif.read;
                        return (
                          <div 
                            key={notif.id}
                            onClick={() => markSingleRead(notif.id)}
                            className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors flex items-start justify-between group ${isNotifRead ? 'opacity-60' : 'bg-indigo-500/5'}`}
                          >
                            <div className="flex items-start gap-3 min-w-0 pr-2">
                              <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isNotifRead ? 'bg-transparent' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'}`} />
                              <div className="min-w-0">
                                <p className="text-sm text-slate-200 font-medium mb-1 leading-tight truncate">{notif.title}</p>
                                <p className="text-xs text-slate-400 line-clamp-2">{notif.message}</p>
                                <span className="text-[10px] text-slate-500 mt-2 block font-medium">{formatTime(notif.createdAt || notif.time)}</span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => deleteSingle(notif.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity shrink-0"
                              title="Delete notification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-indigo-500/10 text-center bg-slate-900/30">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      router.push('/notifications');
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Link */}
          <a
            href="/profile"
            className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-80 transition-opacity"
            title="My Profile"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full object-cover border border-indigo-500/30 ring-2 ring-indigo-500/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}
