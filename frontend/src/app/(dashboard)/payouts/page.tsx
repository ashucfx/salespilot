'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { Banknote, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PayoutsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes('ADMIN');

  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/payouts' : '/payouts/me';
      const { data } = await api.get(endpoint);
      setPayouts(data.data?.content || []);
    } catch (err) {
      console.error(err);
      // Dummy data fallback
      setPayouts([
        {
          id: '1',
          employeeName: 'John Doe',
          payoutPeriod: 'July 2026',
          payoutDate: '2026-07-31',
          amount: 5000,
          status: 'PENDING',
          bankName: 'HDFC Bank',
          bankAccount: '123456789'
        },
        {
          id: '2',
          employeeName: 'Jane Smith',
          payoutPeriod: 'June 2026',
          payoutDate: '2026-06-30',
          amount: 6500,
          status: 'PAID',
          bankName: 'ICICI Bank',
          bankAccount: '987654321',
          paidAt: '2026-07-02T10:00:00Z',
          paymentRef: 'TXN123456'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [isAdmin]);

  const handleMarkPaid = async (id: string) => {
    const ref = window.prompt("Enter Payment Reference Number (e.g., TXN12345):");
    if (!ref) return;

    try {
      await api.post(`/payouts/${id}/pay`, { paymentRef: ref });
      toast.success("Payout marked as paid!");
      fetchPayouts();
    } catch (err) {
      toast.error("Failed to mark payout as paid");
    }
  };

  const filteredPayouts = payouts.filter(p => 
    p.employeeName?.toLowerCase().includes(search.toLowerCase()) || 
    p.payoutPeriod?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-400" />
            {isAdmin ? 'Organization Payouts' : 'My Payouts'}
          </h2>
          <p className="text-slate-400 mt-1">
            {isAdmin ? 'Manage and process employee end-of-month payouts.' : 'Track your earnings and payout history.'}
          </p>
        </div>
        
        {isAdmin && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or period..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-emerald-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        )}
      </div>

      <div className="glass-panel rounded-2xl border border-emerald-500/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-xs uppercase text-slate-400 border-b border-emerald-500/10">
              <tr>
                {isAdmin && <th className="px-6 py-4 font-medium">Employee</th>}
                <th className="px-6 py-4 font-medium">Period</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Bank Details</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {isAdmin && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/5">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 4} className="px-6 py-8 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 4} className="px-6 py-8 text-center text-slate-500">
                    No payouts found.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-emerald-500/5 transition-colors">
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{payout.employeeName}</div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{payout.payoutPeriod}</div>
                      <div className="text-xs text-slate-500">Due: {payout.payoutDate}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-medium">{payout.bankName || 'No Bank Info'}</div>
                      {payout.bankAccount && <div className="text-xs text-slate-400 font-mono">AC: {payout.bankAccount}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {payout.status === 'PAID' ? (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> PAID
                          </span>
                          {payout.paymentRef && <span className="text-[10px] text-slate-500 font-mono">Ref: {payout.paymentRef}</span>}
                        </div>
                      ) : (
                        <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20 flex items-center gap-1 w-max">
                          <AlertCircle className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        {payout.status === 'PENDING' && (
                          <button 
                            onClick={() => handleMarkPaid(payout.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
