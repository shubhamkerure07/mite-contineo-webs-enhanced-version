import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, User, ChevronRight, Sparkles, Coffee } from 'lucide-react';
import { TimetablePeriod } from '../types';

interface TimetableProps {
  schedule: TimetablePeriod[];
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export default function Timetable({ schedule }: TimetableProps) {
  const [selectedDay, setSelectedDay] = useState<typeof WEEKDAYS[number]>('Monday');

  // Filter periods for selected day
  const dailyPeriods = schedule
    .filter(item => item.day === selectedDay)
    .sort((a, b) => a.period - b.period);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Calendar className="h-5.5 w-5.5 text-blue-600" /> Weekly Schedule Grid
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Official class hour schedule for computer science branches standard 6th Semester. Timings are subject to laboratory allocations.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 self-start md:self-center border border-blue-100 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Working Hours: 9:00 AM - 3:45 PM
        </div>
      </div>

      {/* Week Day Picker buttons */}
      <div className="flex overflow-x-auto p-1 bg-white border border-slate-100 rounded-2xl gap-1 no-scrollbar shadow-xs">
        {WEEKDAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex-1 whitespace-nowrap cursor-pointer text-center ${
              selectedDay === day 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Structured Day slots view */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main schedule timeline */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Planned Lectures ({selectedDay})
              </span>
              <span className="text-[10px] text-slate-400 font-semibold italic">
                Lunch Break: 1:00 PM - 1:55 PM
              </span>
            </div>

            <div className="relative border-l-2 border-slate-100 pl-4 ml-2 space-y-5 py-2">
              {dailyPeriods.map((item, index) => {
                const isLab = item.subjectCode.toLowerCase().includes('l66') || item.subjectCode.toLowerCase().includes('l67');
                const isSpecial = item.subjectCode.match(/(Sports|Activity|Placement|Counseling|Mentoring)/gi);

                return (
                  <div key={index} className="relative group">
                    {/* Ring timeline indicator */}
                    <div className="absolute -left-[25px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-slate-200 group-hover:bg-blue-650 group-hover:border-blue-100 transition-colors"></div>
                    
                    <div className={`p-4 rounded-2xl border transition-all ${
                      isLab 
                        ? 'bg-emerald-50/40 border-emerald-100/60 hover:border-emerald-250 hover:bg-emerald-50' 
                        : isSpecial 
                        ? 'bg-amber-50/30 border-amber-100/50 hover:bg-amber-50' 
                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                            <span className="bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono uppercase font-black">{item.subjectCode}</span>
                            <span>• Hour slot {item.period}</span>
                          </div>
                          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
                            {item.subjectName}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium sm:text-right shrink-0">
                          {/* Duration slot */}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            <span>{item.time}</span>
                          </div>
                          {/* Room allocation */}
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span className="font-bold text-slate-700">{item.room}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {dailyPeriods.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No classes scheduled for this day
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side suggestions: Institutional alerts & college timings */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Campus Timings & Rules
            </h3>
            
            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-semibold">
              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
                <div>
                  <p className="text-slate-800 font-extrabold">Bus Transport Departures</p>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">MITE vehicles leave parking bay promptly at 4:00 PM for all regional routes (Mangalore, Udupi, Karkala, Moodabidri).</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
                <div>
                  <p className="text-slate-800 font-extrabold">Academic Remedial Slots</p>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">Remedial coaching for complex topics (Computer Graphics, Cryptography) takes place daily between 4:00 PM - 4:45 PM.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-[10px] shrink-0 font-bold">3</span>
                <div>
                  <p className="text-slate-800 font-extrabold">Gate Security Protocol</p>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">Day-scholar gates open at 8:30 AM. Attendance entry is registered biometric-scanned before 8:55 AM.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick campus cafe / lunch card */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100/50 text-xs text-indigo-900 flex gap-4 items-start relative overflow-hidden">
            <Coffee className="absolute right-3 bottom-0 h-10 w-10 text-indigo-200/50 pointer-events-none" />
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 mt-0.5">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-indigo-950">Daily Recess Hours</h4>
              <p className="text-slate-600 leading-relaxed font-semibold">
                Enjoy hot meals, snacks at the central Green Food Court. Special meal coupons are downloadable via Contineo accounts during billing cycles.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
