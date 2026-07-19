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
  Activity
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

const getNavItems = (roles: string[]) => {
  const isAdmin = roles.includes('ADMIN');
  const isManager = roles.includes('SALES_MANAGER');
  
  const items = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Target },
    { name: 'Pipeline', href: '/pipeline', icon: Activity },
    { name: 'Companies', href: '/companies', icon: Briefcase },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'ICPs', href: '/icps', icon: Target },
    { name: 'Tasks', href: '/tasks', icon: Activity },
    { name: 'Meetings', href: '/meetings', icon: Users },
    { name: 'Deals', href: '/deals', icon: Briefcase },
    { name: 'Commissions', href: '/commissions', icon: Banknote },
    { name: 'Targets', href: '/targets', icon: TrendingUp },
  ];

  if (isAdmin || isManager) {
    items.push({ name: 'Team', href: '/team', icon: Users });
  }
  
  if (isAdmin) {
    items.push({ name: 'Settings', href: '/settings', icon: Settings });
  }
  
  return items;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const roles = user?.roles || [];
  
  const navItems = getNavItems(roles);

  return (
    <div className="flex h-screen w-64 flex-col bg-[#131320] border-r border-indigo-500/10">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-indigo-500/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
            Sales Pilot
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive 
                  ? "text-white bg-indigo-500/10" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"
                )} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-indigo-400/50" />}
            </Link>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="shrink-0 p-4 border-t border-indigo-500/10 bg-slate-900/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.email}
            </p>
            <p className="text-xs text-slate-400 truncate capitalize">
              {roles[0]?.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
