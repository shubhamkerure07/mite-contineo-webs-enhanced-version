import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  Minus, 
  RefreshCw, 
  Check, 
  TrendingUp, 
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { SubjectAttendance } from '../types';

interface AttendanceTrackerProps {
  initialAttendance: SubjectAttendance[];
  onSave: (updated: SubjectAttendance[]) => void;
}

export default function AttendanceTracker({ initialAttendance, onSave }: AttendanceTrackerProps) {
  const [attendance, setAttendance] = useState<SubjectAttendance[]>(JSON.parse(JSON.stringify(initialAttendance)));
  const [successMsg, setSuccessMsg] = useState(false);

  // Reset to server values
  const handleReset = () => {
    setAttendance(JSON.parse(JSON.stringify(initialAttendance)));
    setSuccessMsg(false);
  };

  // Save simulated changes
  const handleSaveChanges = () => {
    onSave(attendance);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  // Core Simulation Math Helpers
  const calcPercentage = (conducted: number, attended: number) => {
    if (conducted === 0) return 0;
    return (attended / conducted) * 100;
  };

  // Calculates how many consecutive classes are needed to reach target percentage (default 75% or 85%)
  const getConsecutiveNeeded = (conducted: number, attended: number, target = 75) => {
    const fraction = target / 100;
    // (attended + X) / (conducted + X) >= fraction
    // attended + X >= fraction * conducted + fraction * X
    // X * (1 - fraction) >= fraction * conducted - attended
    // X >= (fraction * conducted - attended) / (1 - fraction)
    if (conducted === 0) return 0;
    const currentPct = (attended / conducted) * 100;
    if (currentPct >= target) return 0;
    const numerator = fraction * conducted - attended;
    const denominator = 1 - fraction;
    return Math.ceil(numerator / denominator);
  };

  // Calculates how many classes the student can safely bunk before falling below target
  const getSafeBunks = (conducted: number, attended: number, target = 75) => {
    const fraction = target / 100;
    // attended / (conducted + Y) >= fraction
    // attended >= fraction * conducted + fraction * Y
    // fraction * Y <= attended - fraction * conducted
    // Y <= (attended / fraction) - conducted
    if (conducted === 0) return 0;
    const currentPct = (attended / conducted) * 100;
    if (currentPct < target) return 0;
    const maxConductedWithThisAttendance = attended / fraction;
    const result = Math.floor(maxConductedWithThisAttendance - conducted);
    return Math.max(0, result);
  };

  const handleUpdateClasses = (code: string, field: 'conducted' | 'attended', increment: boolean) => {
    setAttendance(prev => prev.map(sub => {
      if (sub.code === code) {
        const item = { ...sub };
        if (field === 'conducted') {
          const newVal = Math.max(0, item.conducted + (increment ? 1 : -1));
          item.conducted = newVal;
          if (item.attended > newVal) {
            item.attended = newVal;
          }
        } else {
          const change = increment ? 1 : -1;
          const newVal = Math.max(0, item.attended + change);
          item.attended = Math.min(newVal, item.conducted);
        }
        return item;
      }
      return sub;
    }));
  };

  const simulateQuickAction = (code: string, outcome: 'attend' | 'bunk') => {
    setAttendance(prev => prev.map(sub => {
      if (sub.code === code) {
        return {
          ...sub,
          conducted: sub.conducted + 1,
          attended: sub.attended + (outcome === 'attend' ? 1 : 0)
        };
      }
      return sub;
    }));
  };

  // Overall Statistics
  const totalConducted = attendance.reduce((acc, s) => acc + s.conducted, 0);
  const totalAttended = attendance.reduce((acc, s) => acc + s.attended, 0);
  const totalPercentage = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <TrendingUp className="h-5.5 w-5.5 text-blue-600" /> Attendance Simulator
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Simulate future classes, forecast buffer margins, and avoid VTU exam registration shortages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
            id="btn-attendance-reset"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset Portal Values
          </button>
          
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm"
            id="btn-attendance-save"
          >
            <Check className="h-3.5 w-3.5" /> Save Simulated State
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-medium animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Simulated state offline saved successfully! Your custom stats will be reflected in the dashboard.</span>
        </div>
      )}

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total stats card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className={`p-4 rounded-xl ${totalPercentage >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <Award className="h-8 w-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Margin</span>
            <span className={`block text-2xl font-black ${totalPercentage >= 75 ? 'text-slate-800' : 'text-red-600'}`}>
              {totalPercentage.toFixed(1)}%
            </span>
            <span className="text-[10.5px] text-slate-500 font-medium">
              Conducted: {totalConducted} | Attended: {totalAttended}
            </span>
          </div>
        </div>

        {/* Warning card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-4 rounded-xl bg-orange-50 text-orange-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Thresholds</span>
            <span className="block text-base font-black text-slate-800">
              {attendance.filter(s => calcPercentage(s.conducted, s.attended) < 75).length} Subject Shortages
            </span>
            <span className="text-[10.5px] text-amber-600 font-semibold block mt-0.5">
              Requires urgent simulation below!
            </span>
          </div>
        </div>

        {/* AI Insight / Hack tips */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100/50 shadow-xs flex items-center space-x-4 relative overflow-hidden">
          <Sparkles className="absolute right-3 top-3 h-10 w-10 text-indigo-200 pointer-events-none" />
          <div className="p-3.5 rounded-xl bg-indigo-100 text-indigo-700">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-extrabold text-indigo-500 tracking-wider">VTU Academic Rule</span>
            <h4 className="text-xs font-extrabold text-slate-800">Medical Buffer Limit</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed max-w-xs font-medium">
              Shortages below 75% require formal medical / codonation submissions, capped strictly at 65%.
            </p>
          </div>
        </div>

      </div>

      {/* Main Subject Grid */}
      <div className="space-y-4">
        {attendance.map((sub) => {
          const pct = calcPercentage(sub.conducted, sub.attended);
          const needsConsecutive75 = getConsecutiveNeeded(sub.conducted, sub.attended, 75);
          const needsConsecutive85 = getConsecutiveNeeded(sub.conducted, sub.attended, 85);
          const safeBunks75 = getSafeBunks(sub.conducted, sub.attended, 75);
          const isShortage = pct < 75;

          return (
            <div 
              key={sub.code}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                isShortage 
                  ? 'border-red-200/80 bg-gradient-to-r from-red-50/20 to-transparent' 
                  : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Subject Primary Details */}
                <div className="space-y-1.5 flex-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                      {sub.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-1.5 py-0.2 rounded">
                      {sub.type}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-800 text-base leading-snug">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Instructor: <span className="font-semibold text-slate-700">{sub.instructor}</span>
                  </p>
                </div>

                {/* Simulated Toggles (Conducted & Attended) */}
                <div className="flex items-center gap-6 py-2 px-4 bg-slate-50 rounded-xl border border-slate-100 self-start lg:self-center">
                  
                  {/* Conducted edit */}
                  <div className="text-center font-sans">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Conducted Code</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleUpdateClasses(sub.code, 'conducted', false)}
                        className="p-1 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 cursor-pointer transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 font-bold text-sm text-slate-800">{sub.conducted}</span>
                      <button 
                        onClick={() => handleUpdateClasses(sub.code, 'conducted', true)}
                        className="p-1 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 cursor-pointer transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="h-8 border-r border-slate-200"></div>

                  {/* Attended edit */}
                  <div className="text-center font-sans">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Attended Code</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleUpdateClasses(sub.code, 'attended', false)}
                        className="p-1 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 cursor-pointer transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 font-bold text-sm text-slate-800">{sub.attended}</span>
                      <button 
                        onClick={() => handleUpdateClasses(sub.code, 'attended', true)}
                        className="p-1 rounded-md bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 cursor-pointer transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Speed Actions (Simulate next class instantly) */}
                <div className="space-y-1.5 self-start lg:self-center">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Simulate Next Session</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => simulateQuickAction(sub.code, 'attend')}
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Present
                    </button>
                    <button
                      onClick={() => simulateQuickAction(sub.code, 'bunk')}
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-800 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" /> Absent
                    </button>
                  </div>
                </div>

                {/* Graphical Percentage display & Status Buffer messages */}
                <div className="flex items-center space-x-4 min-w-[200px] shrink-0 justify-between">
                  <div className="space-y-1 text-right flex-1">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className={`text-2xl font-black ${isShortage ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>

                    {/* Threshold analysis helper details */}
                    <div className="text-[11px] font-medium leading-tight">
                      {isShortage ? (
                        <div className="text-red-650 font-bold space-y-0.5">
                          <span className="block text-[10px] bg-red-100/55 rounded-sm px-1 py-0.2 select-none inline-block">SHORTAGE!</span>
                          <span className="block">Must attend <span className="underline">{needsConsecutive75}</span> more class{needsConsecutive75 !== 1 ? 'es' : ''} to reach 75%.</span>
                        </div>
                      ) : (
                        <div className="text-slate-500">
                          {safeBunks75 > 0 ? (
                            <span className="text-emerald-700 font-bold">
                              Can safely bunk <span className="underline">{safeBunks75}</span> class{safeBunks75 !== 1 ? 'es' : ''}.
                            </span>
                          ) : (
                            <span className="text-amber-600 font-bold">
                              No cushion margin. Do not bunk!
                            </span>
                          )}
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            Next goal: attend <span className="font-semibold">{needsConsecutive85}</span> classes to hit 85%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Circular/Square Graphic display */}
                  <div className="relative flex items-center justify-center h-14 w-14 rounded-xl border border-slate-100 bg-slate-50 shrink-0">
                    <div className={`h-2.5 w-2.5 rounded-full absolute top-1.5 right-1.5 ${isShortage ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
                    <span className={`text-xs font-black ${isShortage ? 'text-red-600' : 'text-slate-800'}`}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
