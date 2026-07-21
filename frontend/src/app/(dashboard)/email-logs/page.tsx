'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/email-logs?size=100'); // Fetch latest 100
      if (res.data?.data?.content) {
        setLogs(res.data.data.content);
      }
    } catch (error) {
      toast.error('Failed to load email logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Mail className="w-8 h-8 text-indigo-400" />
            Email Logs
          </h1>
          <p className="text-slate-400 mt-2">Monitor system email deliverability and errors</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Recipient</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Subject</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Sent At</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Error Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-6 bg-slate-800/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Mail className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    No emails logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      {log.status === 'SUCCESS' ? (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full w-fit">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-semibold">SUCCESS</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full w-fit">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-semibold">FAILED</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                      {log.recipient}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {log.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                      {format(new Date(log.sentAt), 'MMM d, h:mm a')}
                    </td>
                    <td className="px-6 py-4 text-sm text-rose-400/80 max-w-xs truncate" title={log.errorMessage}>
                      {log.errorMessage || '-'}
                    </td>
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
