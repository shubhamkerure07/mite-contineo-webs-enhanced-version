import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AttendanceTracker from './components/AttendanceTracker';
import MarksManager from './components/MarksManager';
import Timetable from './components/Timetable';
import FeesCenter from './components/FeesCenter';
import MentorPortal from './components/MentorPortal';
import Circulars from './components/Circulars';

import { 
  defaultProfile, 
  defaultAttendance, 
  defaultMarks, 
  defaultFees, 
  defaultTimetable, 
  defaultCirculars, 
  defaultMessages, 
  defaultLeaves,
  mockUndeclaredStudents 
} from './data';
import { StudentProfile, SubjectAttendance, SubjectMarks, FeeItem, TimetablePeriod, AcademicCircular, MentorMessage, LeaveRequest } from './types';
import { 
  GraduationCap, 
  LogOut, 
  LayoutDashboard, 
  TrendingUp, 
  Calculator, 
  Calendar, 
  Megaphone, 
  CreditCard, 
  UserPlus, 
  Settings, 
  User,
  Menu,
  X,
  UserCheck
} from 'lucide-react';

export default function App() {
  // Session Persistence States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<'student' | 'parent' | 'admin'>('parent');
  const [usn, setUsn] = useState('');
  
  // App navigation
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'attendance' | 'marks' | 'timetable' | 'circulars' | 'fees' | 'mentor'>('dashboard');

  // Academic States
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<SubjectAttendance[]>([]);
  const [marks, setMarks] = useState<SubjectMarks[]>([]);
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [timetable, setTimetable] = useState<TimetablePeriod[]>([]);
  const [circulars, setCirculars] = useState<AcademicCircular[]>([]);
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  // Menu Toggle for smaller mobile displays
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile Edit modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editCgpa, setEditCgpa] = useState(8.00);

  // Load session if logged in in background
  useEffect(() => {
    const savedUsn = localStorage.getItem('mite_session_usn');
    const savedRole = localStorage.getItem('mite_session_role') as 'student' | 'parent' | 'admin' | null;

    if (savedUsn && savedRole) {
      setUsn(savedUsn);
      setRole(savedRole);
      setIsLoggedIn(true);
      initializeStudentData(savedUsn);
    }
  }, []);

  const initializeStudentData = (studentUsn: string) => {
    const canonicalUsn = studentUsn.toUpperCase().trim();
    
    // Find if it matches standard predesigned students
    const matchedMock = mockUndeclaredStudents.find(s => s.usn.toUpperCase() === canonicalUsn);
    const mockName = matchedMock ? matchedMock.name : 'Guest Scholar';

    // 1. Profile load
    const keyProfile = `mite_profile_${canonicalUsn}`;
    const savedProfile = localStorage.getItem(keyProfile);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      const initialProf: StudentProfile = {
        ...defaultProfile,
        name: mockName,
        usn: canonicalUsn,
        email: matchedMock ? `${mockName.toLowerCase().replace(/\s+/g, '')}@mite.ac.in` : 'student@mite.ac.in'
      };
      setProfile(initialProf);
      localStorage.setItem(keyProfile, JSON.stringify(initialProf));
    }

    // 2. Attendance load
    const keyAttendance = `mite_attendance_${canonicalUsn}`;
    const savedAttendance = localStorage.getItem(keyAttendance);
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    } else {
      setAttendance(defaultAttendance);
      localStorage.setItem(keyAttendance, JSON.stringify(defaultAttendance));
    }

    // 3. Marks load
    const keyMarks = `mite_marks_${canonicalUsn}`;
    const savedMarks = localStorage.getItem(keyMarks);
    if (savedMarks) {
      setMarks(JSON.parse(savedMarks));
    } else {
      setMarks(defaultMarks);
      localStorage.setItem(keyMarks, JSON.stringify(defaultMarks));
    }

    // 4. Fees load
    const keyFees = `mite_fees_${canonicalUsn}`;
    const savedFees = localStorage.getItem(keyFees);
    if (savedFees) {
      setFees(JSON.parse(savedFees));
    } else {
      setFees(defaultFees);
      localStorage.setItem(keyFees, JSON.stringify(defaultFees));
    }

    // 5. Timetable load
    setTimetable(defaultTimetable);

    // 6. Circulars
    const keyCirculars = `mite_circulars_global`;
    const savedCirculars = localStorage.getItem(keyCirculars);
    if (savedCirculars) {
      setCirculars(JSON.parse(savedCirculars));
    } else {
      setCirculars(defaultCirculars);
      localStorage.setItem(keyCirculars, JSON.stringify(defaultCirculars));
    }

    // 7. Messages
    const keyMessages = `mite_messages_${canonicalUsn}`;
    const savedMessages = localStorage.getItem(keyMessages);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(defaultMessages);
      localStorage.setItem(keyMessages, JSON.stringify(defaultMessages));
    }

    // 8. Leaves
    const keyLeaves = `mite_leaves_${canonicalUsn}`;
    const savedLeaves = localStorage.getItem(keyLeaves);
    if (savedLeaves) {
      setLeaves(JSON.parse(savedLeaves));
    } else {
      setLeaves(defaultLeaves);
      localStorage.setItem(keyLeaves, JSON.stringify(defaultLeaves));
    }
  };

  const handleLoginSuccess = (studentUsn: string, userRole: 'parent' | 'student' | 'admin') => {
    const cleanUsn = userRole === 'admin' ? '4MT22CS148' : studentUsn.toUpperCase().trim();
    setUsn(cleanUsn);
    setRole(userRole);
    setIsLoggedIn(true);

    localStorage.setItem('mite_session_usn', cleanUsn);
    localStorage.setItem('mite_session_role', userRole);

    initializeStudentData(cleanUsn);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsn('');
    setProfile(null);
    localStorage.removeItem('mite_session_usn');
    localStorage.removeItem('mite_session_role');
  };

  // Updaters for Children Components
  const handleSaveAttendance = (updated: SubjectAttendance[]) => {
    setAttendance(updated);
    if (usn) {
      localStorage.setItem(`mite_attendance_${usn}`, JSON.stringify(updated));
    }
  };

  const handleSaveMarks = (updated: SubjectMarks[]) => {
    setMarks(updated);
    if (usn) {
      localStorage.setItem(`mite_marks_${usn}`, JSON.stringify(updated));
    }
  };

  const handleSaveFees = (updated: FeeItem[]) => {
    setFees(updated);
    if (usn) {
      localStorage.setItem(`mite_fees_${usn}`, JSON.stringify(updated));
    }
  };

  const handleSaveMessages = (updated: MentorMessage[]) => {
    setMessages(updated);
    if (usn) {
      localStorage.setItem(`mite_messages_${usn}`, JSON.stringify(updated));
    }
  };

  const handleSaveLeaves = (updated: LeaveRequest[]) => {
    setLeaves(updated);
    if (usn) {
      localStorage.setItem(`mite_leaves_${usn}`, JSON.stringify(updated));
    }
  };

  // Edit Profile dialog triggers
  const openEditProfile = () => {
    if (!profile) return;
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditMobile(profile.mobile);
    setEditCgpa(profile.cgpa);
    setIsEditingProfile(true);
  };

  const saveEditedProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !usn) return;

    const updated: StudentProfile = {
      ...profile,
      name: editName.trim(),
      email: editEmail.trim(),
      mobile: editMobile.trim(),
      cgpa: Math.min(10.0, Math.max(0.0, editCgpa))
    };

    setProfile(updated);
    localStorage.setItem(`mite_profile_${usn}`, JSON.stringify(updated));
    setIsEditingProfile(false);
  };

  if (!isLoggedIn || !profile) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Navigation Links definition
  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance Simulator', icon: TrendingUp },
    { id: 'marks', label: 'Internal Marks', icon: Calculator },
    { id: 'timetable', label: 'Class Timetable', icon: Calendar },
    { id: 'circulars', label: 'Notice bulletins', icon: Megaphone },
    { id: 'fees', label: 'Accounts & Fees', icon: CreditCard },
    { id: 'mentor', label: 'Counselor Message Hub', icon: UserCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Faculty Administrator override bar */}
      {role === 'admin' && (
        <div className="bg-amber-500 text-white shadow-md text-xs font-bold font-sans">
          <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-slate-900 border border-slate-900 text-[10px] text-white px-2 py-0.5 rounded-md font-mono tracking-wide uppercase">Admin System Console</span>
              <span>Currently inspecting and managing academic file parameters.</span>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-100 font-semibold">Active Student:</span>
                <select
                  value={usn}
                  onChange={(e) => {
                    const targetUsn = e.target.value;
                    setUsn(targetUsn);
                    initializeStudentData(targetUsn);
                  }}
                  className="bg-white text-slate-800 text-xs py-1 px-2.5 rounded-xl border border-amber-300 font-black cursor-pointer focus:outline-none"
                >
                  <option value="4MT22CS148">Suhas K. Rao (4MT22CS148)</option>
                  <option value="4MT22CS010">Apoorva S. Shetty (4MT22CS010)</option>
                  <option value="4MT22CS082">Mohit Nayak (4MT22CS082)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  const titleInput = prompt("Enter Notice Bulletin Title:");
                  if (!titleInput) return;
                  const categoryInput = prompt("Enter Category (e.g. Exam, Academic, Fees, General, Placement):", "General");
                  const contentInput = prompt("Enter Bulletin Content:");
                  if (!contentInput) return;

                  const newCirc: AcademicCircular = {
                    id: `circ-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    title: titleInput,
                    category: (categoryInput || 'General') as any,
                    content: contentInput,
                    isUrgent: true
                  };
                  const updatedCircs = [newCirc, ...circulars];
                  setCirculars(updatedCircs);
                  localStorage.setItem('mite_circulars_global', JSON.stringify(updatedCircs));
                  alert("Official College Bulletin released successfully! Check the notice board to see it live.");
                }}
                className="bg-slate-900 border border-slate-900 text-white px-3 py-1 rounded-xl text-[11px] font-extrabold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                + Release Bulletin Notice
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Prime Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo Emblem layout */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-150 shrink-0">
                <GraduationCap className="h-5.5 w-5.5" />
              </div>
              <div>
                <span className="font-black text-slate-800 text-lg leading-none block">MITE Contineo</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mt-0.5 sm:mt-0">Academic Portal Companion</span>
              </div>
            </div>

            {/* Desktop Center Navigation links */}
            <nav className="hidden lg:flex space-x-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isSelected = currentTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setCurrentTab(link.id)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Right side Profile details & actions */}
            <div className="hidden sm:flex items-center space-x-3">
              
              <div className="text-right">
                <span className="block text-xs font-black text-slate-800 leading-none truncate max-w-[150px]">
                  {profile.name}
                </span>
                <span className="block text-[9.5px] text-slate-400 font-bold tracking-wider mt-0.5">
                  USN: {profile.usn} | <span className="bg-blue-105 text-blue-700 font-extrabold px-1 py-0.2 rounded-sm capitalize">{role}</span>
                </span>
              </div>

              {/* Edit Profile Quick Click Button */}
              <button
                onClick={openEditProfile}
                className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-xl cursor-pointer transition-colors"
                title="Edit Student profile"
                id="btn-edit-profile-header"
              >
                <Settings className="w-4 h-4" />
              </button>

              <div className="h-6 w-px bg-slate-200"></div>

              {/* Signout action */}
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 hover:bg-rose-50 hover:text-rose-650 text-slate-500 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                id="btn-header-logout"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Mobile menu toggle */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={openEditProfile}
                className="p-2 hover:bg-slate-50 text-slate-500 rounded-lg cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu sheet view */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-150 bg-white p-3 space-y-1 shadow-inner animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isSelected = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentTab(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {link.label}
                </button>
              );
            })}

            <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between px-4">
              <span className="text-[10px] text-slate-400 font-bold">Logged as: {profile.name} ({profile.usn})</span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-650 font-bold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Stage */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <Dashboard 
            profile={profile} 
            attendance={attendance} 
            marks={marks} 
            fees={fees} 
            timetable={timetable} 
            circulars={circulars} 
            role={role}
            onNavigate={(target) => setCurrentTab(target as any)}
            onLogout={handleLogout}
          />
        )}
        {currentTab === 'attendance' && (
          <AttendanceTracker 
            initialAttendance={attendance} 
            onSave={handleSaveAttendance} 
          />
        )}
        {currentTab === 'marks' && (
          <MarksManager 
            initialMarks={marks} 
            onSave={handleSaveMarks} 
          />
        )}
        {currentTab === 'timetable' && (
          <Timetable 
            schedule={timetable} 
          />
        )}
        {currentTab === 'circulars' && (
          <Circulars 
            circulars={circulars} 
          />
        )}
        {currentTab === 'fees' && (
          <FeesCenter 
            initialFees={fees} 
            onSave={handleSaveFees} 
          />
        )}
        {currentTab === 'mentor' && (
          <MentorPortal 
            initialMessages={messages} 
            initialLeaves={leaves} 
            profile={profile}
            onSaveMessages={handleSaveMessages}
            onSaveLeaves={handleSaveLeaves}
          />
        )}
      </main>

      {/* Edit Scholar Profile popup window */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-slate-800 text-lg">Tune Student Coordinates</h3>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEditedProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Name of Scholar</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  max="10.00"
                  min="0.00"
                  required
                  value={editCgpa}
                  onChange={(e) => setEditCgpa(parseFloat(e.target.value) || 0)}
                  className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 text-center font-bold"
                />
              </div>

              <button
                type="submit"
                id="btn-save-edited-profile"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-lg"
              >
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer bar */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          Contineo AMS © {new Date().getFullYear()} Mangalore Institute of Technology & Engineering. Academic Dashboard Companion.
        </div>
      </footer>

    </div>
  );
}
