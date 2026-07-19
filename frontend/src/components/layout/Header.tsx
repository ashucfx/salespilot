'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // Format pathname into a readable title
  const getPageTitle = () => {
    const path = pathname.split('/')[1] || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-16 shrink-0 border-b border-indigo-500/10 bg-[#0f0f1a]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-slate-400 hover:text-white">
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
          <button className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-[#0f0f1a]"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
