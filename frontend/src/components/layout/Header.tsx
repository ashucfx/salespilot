'use client';

import { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/appStore';

// Mock notifications data
const mockNotifications = [
  { id: 1, title: 'New Lead Assigned', message: 'You have been assigned a new lead from Acme Corp.', time: '2 mins ago', read: false },
  { id: 2, title: 'Payout Approaching', message: 'Your commission payout is scheduled for Friday.', time: '1 hour ago', read: false },
  { id: 3, title: 'KYC Approved', message: 'Your KYC documents have been verified successfully.', time: '1 day ago', read: true },
];

export default function Header() {
  const pathname = usePathname();
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Format pathname into a readable title
  const getPageTitle = () => {
    const path = pathname.split('/')[1] || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-16 shrink-0 border-b border-indigo-500/10 bg-[#0f0f1a]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads, deals, employees..."
              className="w-64 bg-slate-900/50 border border-indigo-500/20 rounded-full pl-10 pr-4 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/50 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#0f0f1a]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] border border-indigo-500/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-indigo-500/10 flex justify-between items-center bg-slate-900/50">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => {
                            setNotifications(notifications.map(n => 
                              n.id === notif.id ? { ...n, read: true } : n
                            ));
                          }}
                          className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors ${notif.read ? 'opacity-60' : 'bg-indigo-500/5'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-transparent' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]'}`} />
                            <div>
                              <p className="text-sm text-slate-200 font-medium mb-1 leading-tight">{notif.title}</p>
                              <p className="text-xs text-slate-400 line-clamp-2">{notif.message}</p>
                              <span className="text-[10px] text-slate-500 mt-2 block font-medium">{notif.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-indigo-500/10 text-center bg-slate-900/30">
                  <button className="text-xs text-slate-400 hover:text-white transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
