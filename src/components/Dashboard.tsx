import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  GraduationCap, 
  BookOpen, 
  ChevronRight, 
  BellRing, 
  MessageSquareCode, 
  ArrowRightLeft 
} from 'lucide-react';
import { StudentProfile, SubjectAttendance, SubjectMarks, FeeItem, TimetablePeriod, AcademicCircular } from '../types';

interface DashboardProps {
  profile: StudentProfile;
  attendance: SubjectAttendance[];
  marks: SubjectMarks[];
  fees: FeeItem[];
  timetable: TimetablePeriod[];
  circulars: AcademicCircular[];
  role: 'student' | 'parent' | 'admin';
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

export default function Dashboard({
  profile,
  attendance,
  marks,
  fees,
  timetable,
  circulars,
  role,
  onNavigate,
  onLogout
}: DashboardProps) {
  
  // Calculations
  const totalConducted = attendance.reduce((acc, sub) => acc + sub.conducted, 0);
  const totalAttended = attendance.reduce((acc, sub) => acc + sub.attended, 0);
  const overallAttendancePct = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;
  
  // Calculate average CIE Marks percentage
  // Each subject cieTotal is out of 50. Let's make it easy to see how well they are average.
  const overallCiePct = marks.length > 0 
    ? (marks.reduce((acc, curr) => acc + curr.cieTotal, 0) / (marks.length * 50)) * 100 
    : 0;

  // Fees details
  const totalFees = fees.reduce((acc, curr) => acc + curr.total, 0);
  const paidFees = fees.reduce((acc, curr) => acc + curr.paid, 0);
  const pendingFees = totalFees - paidFees;

  // Shortage subjects
  const shortageSubjects = attendance.filter(sub => {
    const pct = sub.conducted > 0 ? (sub.attended / sub.conducted) * 100 : 0;
    return pct < 75;
  });

  // Hot circulars
  const urgentCirculars = circulars.filter(circ => circ.isUrgent);

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              ● Administrative Control Panel Activated
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {role === 'parent' ? profile.parentName : role === 'admin' ? 'Dr. Sandeep Kumar' : profile.name}!
            </h1>
            <p className="text-blue-100 text-sm max-w-xl">
              {role === 'parent' 
                ? `You're logged into the Parent Gateway monitoring academic progress for your ward, ${profile.name} (${profile.usn}).`
                : role === 'admin'
                ? `You have administrative instructor access. Modify student marks, simulated attendance stats, fees, and publish notice circulars.`
                : `You're logged in as ${profile.name} (USN: ${profile.usn}). Track your attendance buffers and maximize your marks!`
              }
            </p>
          </div>
          
          <div className="flex shrink-0 items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-[10px] text-blue-200 uppercase tracking-widest font-bold">Current CGPA</span>
              <span className="text-2xl font-black text-amber-300">{profile.cgpa.toFixed(2)}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="block text-[10px] text-blue-200 uppercase tracking-widest font-bold">Semester</span>
              <span className="text-2xl font-black text-blue-100">{profile.semester}th</span>
            </div>
          </div>
        </div>

        {/* Quick Profile Meta */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-blue-100">
          <div>
            <span className="block font-medium opacity-60">USN / Branch</span>
            <span className="font-semibold text-white">{profile.usn} / {profile.branch}</span>
          </div>
          <div>
            <span className="block font-medium opacity-60">Local Section</span>
            <span className="font-semibold text-white">{profile.section}</span>
          </div>
          <div>
            <span className="block font-medium opacity-60">Mentor Advisor</span>
            <span className="font-semibold text-white">{profile.mentorName}</span>
          </div>
          <div>
            <span className="block font-medium opacity-60">Institutional Affiliation</span>
            <span className="font-semibold text-white">MITE Mangalore (VTU)</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Attendance Ring/Card */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-500">Overall Attendance</span>
            <span className={`p-2 rounded-xl ${overallAttendancePct >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-black ${overallAttendancePct >= 75 ? 'text-slate-800' : 'text-red-600'}`}>
                {overallAttendancePct.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400 font-medium">({totalAttended}/{totalConducted} classes)</span>
            </div>
            
            {/* Simple progress bar */}
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${overallAttendancePct >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(overallAttendancePct, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold group-hover:text-blue-600 text-slate-500">
            {overallAttendancePct >= 75 ? (
              <span className="text-emerald-600">Great! Above VTU threshold</span>
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 shrink-0" /> {shortageSubjects.length} subject(s) in danger
              </span>
            )}
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* CIE Internals Card */}
        <div 
          onClick={() => onNavigate('marks')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-500">Average CIE Score</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="h-5 w-5" />
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-800">
                {overallCiePct.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400 font-medium">(Average internals)</span>
            </div>
            
            {/* Score rating feedback bar */}
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${overallCiePct}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold group-hover:text-amber-600 text-slate-500">
            <span className="text-indigo-600 italic">CIE Average: {(overallCiePct * 0.5).toFixed(1)} / 50 Marks</span>
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Financial Status Card */}
        <div 
          onClick={() => onNavigate('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-500">Outstanding Fees</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <CreditCard className="h-5 w-5" />
            </span>
          </div>
          <div className="my-2">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-slate-800">
                ₹{pendingFees.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">remaining</span>
            </div>
            {/* Mini billing tracker */}
            <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Paid: ₹{(paidFees / 1000).toFixed(0)}k</span>
              <span className="text-slate-300">|</span>
              <span>Total: ₹{(totalFees / 1000).toFixed(0)}k</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold group-hover:text-blue-600 text-slate-500">
            {pendingFees === 0 ? (
              <span className="text-emerald-600 font-bold">All Fees Cleared</span>
            ) : (
              <span className="text-amber-600">Pending Installment</span>
            )}
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Mentor Updates Card */}
        <div 
          onClick={() => onNavigate('mentor')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-slate-500">Mentor Remarks</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <MessageSquareCode className="h-5 w-5" />
            </span>
          </div>
          <div className="my-2">
            <p className="text-xs text-slate-600 line-clamp-2 italic font-medium leading-relaxed">
              &quot;He is doing exceptionally well otherwise! He scored 38/40 in Web Tech...&quot;
            </p>
            <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              - {profile.mentorName}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold group-hover:text-blue-600 text-slate-500">
            <span className="text-teal-600">Ask Mentor Chatbot</span>
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column: Urgent Warnings / Attendance Tracker widget & Bulletins */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Attendance Warning banner if there's any under 75% */}
          {shortageSubjects.length > 0 && (
            <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                <AlertTriangle className="h-6 w-6 shrink-0" />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-red-900 text-sm">Attendance Alert: Critical Subject Shortage</h4>
                <p className="text-xs text-red-700 font-medium">
                  At MITE (VTU Rules), a minimum of 75% attendance is required per subject to take final exams. 
                  Currently, <span className="font-bold">{shortageSubjects.map(s => s.name).join(', ')}</span> fall below this limit.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('attendance')}
                className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer transition-colors"
                id="btn-nav-shortage"
              >
                Simulate Now
              </button>
            </div>
          )}

          {/* Quick Subject Listing Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" /> Academic Subject Summary
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Quick glance of current semester performance stats</p>
              </div>
              <button 
                onClick={() => onNavigate('marks')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                id="btn-view-all-subjects"
              >
                View Marks Report <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5">Subject</th>
                    <th className="py-2.5">Attendance</th>
                    <th className="py-2.5">CIE Total</th>
                    <th className="py-2.5 text-right">SEE Predictor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {attendance.slice(0, 5).map(sub => {
                    const mathPct = sub.conducted > 0 ? (sub.attended / sub.conducted) * 100 : 0;
                    const matchMark = marks.find(m => m.code === sub.code);
                    return (
                      <tr key={sub.code} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 pr-3">
                          <span className="font-semibold block text-slate-800">{sub.name}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-500 py-0.5 px-1 rounded">{sub.code}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-xs ${mathPct >= 75 ? 'text-slate-700' : 'text-red-500 font-black'}`}>
                              {mathPct.toFixed(0)}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">({sub.attended}/{sub.conducted})</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-xs text-slate-800">
                            {matchMark?.cieTotal ?? '--'} <span className="text-[10px] text-slate-400">/ 50</span>
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                            {matchMark?.seePredicted ?? 70} / 100
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Help & Simulation Explainers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100/50 flex space-x-3 items-start">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Clock className="h-5 w-5 shrink-0" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">Dynamic Attendance Tuning</h4>
                <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                  Bunking a laboratory or skipping theoretical classes? Play with our unique Attendance Simulator tool to determine key shortages before they are submitted.
                </p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 flex space-x-3 items-start">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <GraduationCap className="h-5 w-5 shrink-0" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">CIE and Final Exam Matrix</h4>
                <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                  Enter your IA parameters. Our GPA predictor will calculate the precise VTU target scores you need to secure your desired academic grades or SGPA.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Timetable Schedule & Notice Board alerts */}
        <div className="space-y-6">
          
          {/* Today's Schedule Mini-list */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wide">
                <Calendar className="h-4.5 w-4.5 text-blue-600" /> Today's Agenda
              </h3>
              <button 
                onClick={() => onNavigate('timetable')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
                id="btn-view-full-schedule"
              >
                View Slots <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* List periods */}
            <div className="space-y-3">
              {timetable.slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-100 transition-colors flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-800 block text-ellipsis truncate max-w-[160px]">
                      {item.subjectName}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                      <span className="bg-slate-200/80 text-slate-600 px-1 py-0.2 rounded font-mono">{item.subjectCode}</span>
                      <span>• Room {item.room}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-blue-600 font-bold block flex items-center gap-1 uppercase">
                      <Clock className="w-3 h-3" /> Period {item.period}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block whitespace-nowrap">{item.time.split(' - ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Alerts Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wide">
                <BellRing className="h-4.5 w-4.5 text-blue-600 anim-pulse text-amber-500" /> College Bulletins
              </h3>
              <button 
                onClick={() => onNavigate('circulars')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
                id="btn-view-all-circulars"
              >
                Board <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-3 Divide-y divide-slate-100">
              {circulars.slice(0, 3).map((circ) => (
                <div key={circ.id} className="pt-2 first:pt-0">
                  <div className="flex items-center gap-1.5 mb-1 text-[9px] font-bold">
                    <span className="text-slate-400">{circ.date}</span>
                    <span className="text-slate-300">•</span>
                    <span className={`px-1.5 py-0.2 rounded-sm ${
                      circ.category === 'Exam' ? 'bg-orange-100 text-orange-800' :
                      circ.category === 'Fees' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {circ.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-tight hover:text-blue-600 cursor-pointer">
                    {circ.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-1">
                    {circ.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
