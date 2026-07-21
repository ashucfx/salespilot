'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Target, 
  Banknote,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Activity,
  ShieldAlert,
  CalendarDays,
  Mail
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

const getNavItems = (roles: string[]) => {
  const isAdmin = roles.includes('ADMIN');
  const isManager = roles.includes('SALES_MANAGER');
  const isEmployee = !isAdmin && !isManager;
  
  const items = [];

  // Core for everyone
  items.push({ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard });

  if (isEmployee) {
    items.push({ name: 'My Leads', href: '/leads', icon: Target });
    items.push({ name: 'My Pipeline', href: '/pipeline', icon: Activity });
    items.push({ name: 'My Meetings', href: '/meetings', icon: CalendarDays });
    items.push({ name: 'My Clients', href: '/companies', icon: Briefcase });
    items.push({ name: 'My Payouts', href: '/payouts', icon: Banknote });
  } else {
    items.push({ name: 'All Leads', href: '/leads', icon: Target });
    items.push({ name: 'Pipeline', href: '/pipeline', icon: Activity });
    items.push({ name: 'All Meetings', href: '/meetings', icon: CalendarDays });
    items.push({ name: 'Companies', href: '/companies', icon: Briefcase });
    items.push({ name: 'Deals', href: '/deals', icon: Briefcase });
    items.push({ name: 'Team', href: '/team', icon: Users });
    items.push({ name: 'Payouts', href: '/payouts', icon: Banknote });
    items.push({ name: 'Commissions', href: '/commissions', icon: Banknote });
  }

  // Profile is available for everyone
  items.push({ name: 'My Profile', href: '/profile', icon: Settings });
  
  if (isAdmin) {
    items.push({ name: 'Email Logs', href: '/email-logs', icon: Mail });
    items.push({ name: 'System Users', href: '/users', icon: Users });
    items.push({ name: 'KYC Approvals', href: '/kyc', icon: ShieldAlert });
    items.push({ name: 'Settings', href: '/settings', icon: Settings });
  }
  
  return items;
};

import { useAppStore } from '@/store/appStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const roles = user?.roles || [];
  
  const navItems = getNavItems(roles);

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col bg-[#05050A] border-r border-slate-800/60 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-slate-800/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-indigo-400/20">
            <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white flex items-center drop-shadow-lg">
            SALES<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 ml-0.5">PILOT</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300",
                isActive 
                  ? "text-white bg-gradient-to-r from-indigo-500/15 to-violet-500/5 shadow-[inset_1px_0_0_0_#6366f1]" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isActive ? "bg-indigo-500/20" : "bg-transparent group-hover:bg-slate-800"
                )}>
                  <item.icon className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-300"
                  )} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {item.name}
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-indigo-400/50" />}
            </Link>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="shrink-0 p-4 border-t border-slate-800/60 bg-[#0A0A10]/50 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-white/10 ring-2 ring-background">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-white truncate leading-tight">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-[12px] text-slate-400 truncate capitalize font-medium tracking-wide mt-0.5">
              {roles[0]?.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
        >
          <LogOut className="w-4 h-4" strokeWidth={2.5} />
          Sign Out
        </button>
      </div>
      </div>
    </>
  );
}
