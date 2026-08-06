'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { AlertTriangle, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface CompletionItem {
  label: string;
  done: boolean;
  tab?: string;
}

function calcCompletion(profile: any): { items: CompletionItem[]; pct: number } {
  if (!profile) return { items: [], pct: 0 };
  const items: CompletionItem[] = [
    { label: 'First & Last Name', done: !!(profile.firstName && profile.lastName), tab: 'overview' },
    { label: 'Phone Number', done: !!profile.phone, tab: 'overview' },
    { label: 'Profile Photo', done: !!profile.profilePicture, tab: 'overview' },
    { label: 'Address / City', done: !!(profile.address && profile.city), tab: 'overview' },
    { label: 'KYC National ID', done: !!(profile.nationalId && profile.countryOfId), tab: 'kyc' },
    { label: 'KYC Document Upload', done: !!profile.kycDocumentPath, tab: 'kyc' },
    { label: 'Bank / UPI Details', done: !!(profile.bankAccount || profile.upiId), tab: 'kyc' },
  ];
  const done = items.filter(i => i.done).length;
  return { items, pct: Math.round((done / items.length) * 100) };
}

export default function ProfileCompletionBanner() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  const roles = user?.roles || [];
  const isEmployee = !roles.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN' || r === 'SALES_MANAGER' || r === 'ROLE_SALES_MANAGER');

  // Don't show on profile page itself
  const onProfilePage = pathname?.startsWith('/profile');

  useEffect(() => {
    if (!isEmployee || !user?.id) return;
    // Reset dismissal on page navigation
    setDismissed(false);
    api.get('/employees/me')
      .then(res => setProfile(res.data?.data || null))
      .catch(() => {});
  }, [user?.id, isEmployee]);

  if (!isEmployee || onProfilePage || dismissed || !profile) return null;

  const { items, pct } = calcCompletion(profile);
  if (pct === 100) return null;

  const missing = items.filter(i => !i.done);
  const isLow = pct < 50;
  const isMedium = pct >= 50 && pct < 80;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`mx-4 mt-4 rounded-2xl border p-4 relative z-20 ${
          isLow
            ? 'bg-red-950/60 border-red-500/40 shadow-red-500/10 shadow-lg'
            : isMedium
            ? 'bg-amber-950/60 border-amber-500/40 shadow-amber-500/10 shadow-lg'
            : 'bg-indigo-950/60 border-indigo-500/40 shadow-indigo-500/10 shadow-lg'
        }`}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pr-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2.5 rounded-xl shrink-0 ${isLow ? 'bg-red-500/20' : isMedium ? 'bg-amber-500/20' : 'bg-indigo-500/20'}`}>
              <AlertTriangle className={`w-5 h-5 ${isLow ? 'text-red-400' : isMedium ? 'text-amber-400' : 'text-indigo-400'}`} />
            </div>
            <div className="min-w-0">
              <p className={`font-bold text-sm mb-0.5 ${isLow ? 'text-red-300' : isMedium ? 'text-amber-300' : 'text-indigo-300'}`}>
                {isLow ? '⚠️ Profile incomplete — action required!' : 'Complete your profile to unlock all features'}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Missing: {missing.slice(0, 3).map(m => m.label).join(', ')}{missing.length > 3 ? ` +${missing.length - 3} more` : ''}
              </p>
            </div>
          </div>

          {/* Progress ring + CTA */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`h-full rounded-full ${isLow ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-indigo-500'}`}
                />
              </div>
              <span className={`text-sm font-extrabold tabular-nums ${isLow ? 'text-red-400' : isMedium ? 'text-amber-400' : 'text-indigo-400'}`}>
                {pct}%
              </span>
            </div>

            <button
              onClick={() => router.push('/profile')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isLow
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25 shadow-lg'
                  : isMedium
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 shadow-lg'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/25 shadow-lg'
              }`}
            >
              Complete Profile <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
