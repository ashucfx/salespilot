/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, Filter, Clock, MoreVertical, Search, Video, Users, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { format, addDays, subDays } from 'date-fns';
import toast from 'react-hot-toast';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchMeetings();
  }, [currentDate]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      // Mapping to an expected /activities?type=MEETING endpoint.
      const { data } = await api.get('/activities');
      const meetingList = data.filter((item: any) => item.activityType === 'MEETING' || item.type === 'MEETING');
      
      // Basic mock filtering by date to simulate a calendar day view if they had dates
      // Normally the API would handle the date range filtering
      setMeetings(meetingList);
    } catch (err) {
      console.error('Failed to fetch meetings', err);
    } finally {
      setLoading(false);
    }
  };

  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const prevDay = () => setCurrentDate(subDays(currentDate, 1));

  const getStatusColor = (status: string) => {
    if (!status) return 'text-slate-400 border-slate-500/30';
    switch (status.toUpperCase()) {
      case 'UPCOMING': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'COMPLETED': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'CANCELLED': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-400" />
            Meetings
          </h2>
          <p className="text-slate-400 text-sm mt-1">Schedule and join client presentations.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
            <button onClick={prevDay} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-semibold text-white min-w-[120px] text-center">
              {format(currentDate, 'MMM dd, yyyy')}
            </span>
            <button onClick={nextDay} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 h-[calc(100vh-12rem)] min-h-[500px]">
        
        {/* Left Sidebar - Mini Calendar/Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-6 flex flex-col hidden md:flex">
          <div className="glass-panel p-5 rounded-3xl">
            <h3 className="text-sm font-bold text-white mb-4">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/50 bg-slate-800" defaultChecked />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">My Meetings</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/50 bg-slate-800" defaultChecked />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Team Meetings</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Content - Meetings List */}
        <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col relative">
          <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/30">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search attendees or subjects..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-9 pr-4 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
            <button onClick={() => toast.success('Feature in development. Coming in next phase.')} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl border border-slate-700/50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : meetings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3">
                <Calendar className="w-12 h-12 text-slate-600" />
                <p>No meetings scheduled for this day.</p>
              </div>
            ) : (
              meetings.map((meeting, i) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-5 rounded-2xl border transition-all hover:bg-slate-800/40 cursor-pointer group ${getStatusColor(meeting.status)} bg-slate-900/50`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      {/* Time Block */}
                      <div className="text-center shrink-0 w-16">
                        <p className="text-lg font-bold text-white">{meeting.time || 'TBD'}</p>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{meeting.duration ? `${meeting.duration}m` : ''}</p>
                      </div>
                      
                      {/* Divider */}
                      <div className="w-px bg-slate-700/50 h-auto" />
                      
                      {/* Info */}
                      <div>
                        <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{meeting.subject || meeting.title || 'Untitled Meeting'}</h4>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          {meeting.type === 'Video Call' || meeting.activityType === 'MEETING' ? (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <Video className="w-3.5 h-3.5" />
                              Google Meet
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <Users className="w-3.5 h-3.5" />
                              In Person
                            </div>
                          )}
                          
                          {meeting.relatedTo && (
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <Building2 className="w-3.5 h-3.5" />
                              {meeting.relatedTo}
                            </div>
                          )}
                        </div>
                        
                        {/* Attendees Mock */}
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].slice(0, meeting.attendeesCount || 2).map((_, idx) => (
                              <div key={idx} className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-300">
                                {String.fromCharCode(65 + idx)}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-slate-500 font-medium">+{meeting.attendeesCount || 2} attendees</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <button onClick={() => toast.success('Options menu coming soon.')} className="p-1.5 text-slate-500 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {(meeting.status === 'UPCOMING' || !meeting.status) && (meeting.type === 'Video Call' || meeting.activityType === 'MEETING') && (
                        <button onClick={() => toast.success('Video integration coming soon.')} className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg text-xs font-bold transition-colors">
                          Join Call
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
