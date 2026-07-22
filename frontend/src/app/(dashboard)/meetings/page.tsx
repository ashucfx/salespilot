'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  CalendarDays, 
  Video, 
  MapPin, 
  Clock, 
  Plus, 
  X,
  ExternalLink 
} from 'lucide-react';
import { format } from 'date-fns';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'ONLINE',
    scheduledAt: '',
    durationMinutes: 60,
    agenda: '',
    location: ''
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/meetings');
      if (res.data?.data?.content) {
        setMeetings(res.data.data.content);
      }
    } catch (error) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        autoGenerateLink: formData.type === 'ONLINE'
      };

      await api.post('/meetings', payload);
      toast.success('Meeting scheduled successfully');
      setIsModalOpen(false);
      fetchMeetings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;
    try {
      await api.put(`/meetings/${id}/cancel`);
      toast.success('Meeting cancelled');
      fetchMeetings();
    } catch (error) {
      toast.error('Failed to cancel meeting');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-indigo-400" />
            My Meetings
          </h1>
          <p className="text-slate-400 mt-2">Schedule and manage your client meetings</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-5 h-5" />
          Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-700/50" />
          ))
        ) : meetings.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
            <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No meetings scheduled.</p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <div 
              key={meeting.id} 
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/30 transition-all group shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white line-clamp-1">{meeting.title}</h3>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  meeting.status === 'SCHEDULED' ? 'bg-indigo-500/20 text-indigo-400' :
                  meeting.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {meeting.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Clock className="w-4 h-4 text-slate-500" />
                  {format(new Date(meeting.scheduledAt), 'MMM d, yyyy • h:mm a')} ({meeting.durationMinutes}m)
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  {meeting.type === 'ONLINE' ? (
                    <Video className="w-4 h-4 text-slate-500" />
                  ) : (
                    <MapPin className="w-4 h-4 text-slate-500" />
                  )}
                  {meeting.location || 'Online'}
                </div>
              </div>

              <div className="flex gap-3">
                {meeting.meetingUrl && meeting.status === 'SCHEDULED' && (
                  <a 
                    href={meeting.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-xl transition-colors border border-indigo-500/20"
                  >
                    <Video className="w-4 h-4" />
                    Join Call
                  </a>
                )}
                {meeting.status === 'SCHEDULED' && (
                  <button
                    onClick={() => handleCancel(meeting.id)}
                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium rounded-xl transition-colors border border-rose-500/20"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A10] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Schedule Meeting</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Discovery Call with Acme Corp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Duration (mins)</label>
                  <select
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({...formData, durationMinutes: Number(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value={15}>15 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Meeting Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'ONLINE'})}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${
                      formData.type === 'ONLINE' 
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Video className="w-4 h-4" /> Online (Jitsi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'OFFLINE'})}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${
                      formData.type === 'OFFLINE' 
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <MapPin className="w-4 h-4" /> In Person
                  </button>
                </div>
              </div>

              {formData.type === 'OFFLINE' && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Location / Address</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. 123 Business Rd"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
