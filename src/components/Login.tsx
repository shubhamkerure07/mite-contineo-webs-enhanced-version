import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Lock, Phone, User, Key, CheckCircle, Info } from 'lucide-react';
import { mockUndeclaredStudents } from '../data';

interface LoginProps {
  onLoginSuccess: (usn: string, role: 'parent' | 'student' | 'admin') => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [role, setRole] = useState<'parent' | 'student' | 'admin'>('parent');
  const [usn, setUsn] = useState('');
  const [credential, setCredential] = useState(''); // Mobile for parent, DOB/Password for student, admin password
  const [error, setError] = useState('');
  const [isDemoOpen, setIsDemoOpen] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!usn.trim()) {
      setError(role === 'admin' ? 'Staff Access ID is required' : 'USN is required');
      return;
    }
    if (!credential.trim()) {
      setError(
        role === 'parent' 
          ? 'Parent Mobile Number is required' 
          : role === 'admin' 
          ? 'Admin Password/Pin is required' 
          : 'Password/DOB is required'
      );
      return;
    }

    // Clean up inputs
    const cleanUsn = usn.trim().toUpperCase();
    const cleanCred = credential.trim();

    // Check admin role
    if (role === 'admin') {
      if (cleanCred.toLowerCase() === 'admin' || cleanCred === 'password' || cleanCred === '123456') {
        onLoginSuccess('STAFF001', 'admin');
      } else {
        setError('Invalid staff credentials. For quick trial, select Admin Login above and use password "admin".');
      }
      return;
    }

    // Check against mock database
    const student = mockUndeclaredStudents.find(
      s => s.usn.toUpperCase() === cleanUsn
    );

    if (student) {
      if (role === 'parent') {
        const lastDigits = student.phone.slice(-4);
        const lastInputDigits = cleanCred.slice(-4);
        if (lastInputDigits === lastDigits || cleanCred === student.phone) {
          onLoginSuccess(student.usn, 'parent');
        } else {
          setError(`Invalid Mobile Number. For testing Suhas, use ${student.phone} (or any mobile ending in ${lastDigits}).`);
        }
      } else {
        // student role - accepts DOB or 'password'
        if (cleanCred === 'password' || cleanCred === student.dob || cleanCred === '123456') {
          onLoginSuccess(student.usn, 'student');
        } else {
          setError(`Invalid Password. For testing, use "password" or "${student.dob}".`);
        }
      }
    } else {
      // General fall-through for custom student
      onLoginSuccess(cleanUsn, 'student');
    }
  };

  const fillDemo = (studentUsn: string) => {
    if (role === 'admin') {
      setUsn('STAFF2026');
      setCredential('admin');
      setError('');
      return;
    }
    const s = mockUndeclaredStudents.find(st => st.usn === studentUsn);
    if (s) {
      setUsn(s.usn);
      setCredential(role === 'parent' ? s.phone : 'password');
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Emblem */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <GraduationCap className="h-9 w-9" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800 tracking-tight">
          MITE Contineo
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Mangalore Institute of Technology & Engineering
        </p>
        <p className="text-center text-xs text-blue-600 font-medium tracking-wide uppercase mt-1">
          Academic Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100 sm:px-10">
          {/* Role selector */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setRole('parent');
                setError('');
                setCredential('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                role === 'parent'
                  ? 'bg-white text-blue-650 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Parent
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setError('');
                setCredential('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                role === 'student'
                  ? 'bg-white text-blue-650 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setError('');
                setCredential('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-white text-blue-650 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Faculty / Admin
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="usn" className="block text-sm font-semibold text-slate-700">
                {role === 'admin' ? 'Staff Representative ID' : 'Student USN'}
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="usn"
                  name="usn"
                  type="text"
                  required
                  placeholder={role === 'admin' ? 'e.g. STAFF2026' : 'e.g. 4MT22CS148'}
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="credential" className="block text-sm font-semibold text-slate-700">
                {role === 'parent' ? 'Registered Parent Mobile Number' : role === 'admin' ? 'Administrative Secret PIN / Password' : 'Password / DOB'}
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  {role === 'parent' ? <Phone className="h-5 w-5" /> : <Lock className="h-5 w-5 text-slate-400" />}
                </div>
                <input
                  id="credential"
                  name="credential"
                  type={role === 'parent' ? 'tel' : 'password'}
                  required
                  placeholder={role === 'parent' ? 'e.g. 9448105612' : role === 'admin' ? 'Enter administrative password ("admin")' : 'Password or YYYY-MM-DD'}
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm placeholder-slate-400"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2 text-xs text-red-600 font-medium">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                id="btn-login-submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
              >
                {role === 'admin' ? 'Gain Administrative Access' : 'Sign In to Contineo'}
              </button>
            </div>
          </form>

          {/* Quick Mock Credentials */}
          {isDemoOpen && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                  Quick Trial Profiles (Select any)
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Demo
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {role === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => fillDemo('')}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-left text-xs transition-all duration-150 flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-700 block group-hover:text-blue-700">
                        Academic Counselor / IT Officer <span className="font-mono text-[10px] bg-blue-100 text-blue-700 px-1 py-0.2 rounded ml-1">STAFF2026</span>
                      </span>
                      <span className="text-slate-500 block text-[11px] mt-0.5">
                        Test Code: <span className="font-mono bg-slate-100 text-slate-600 px-1 rounded font-bold">STAFF2026</span> &nbsp;|&nbsp; Password: <span className="font-mono bg-slate-100 text-slate-600 px-1 rounded font-bold">admin</span>
                      </span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform opacity-60 hover:opacity-100" />
                  </button>
                ) : (
                  mockUndeclaredStudents.map((st) => (
                    <button
                      key={st.usn}
                      type="button"
                      onClick={() => fillDemo(st.usn)}
                      className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-left text-xs transition-all duration-150 flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-slate-700 block group-hover:text-blue-700">
                          {st.name} <span className="font-mono text-[10px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded ml-1">{st.usn}</span>
                        </span>
                        <span className="text-slate-500 block text-[11px] mt-0.5">
                          {role === 'parent' ? `Mobile: ${st.phone}` : `DOB: ${st.dob}`}
                        </span>
                      </div>
                      <CheckCircle className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform opacity-60 hover:opacity-100" />
                    </button>
                  ))
                )}
              </div>
              <div className="mt-3 text-center text-[10px] text-slate-400">
                You can also enter any other matching USN and password to create a flexible custom student profile on the fly!
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Contineo AMS © {new Date().getFullYear()} MITE Mangalore. Reimagined Portal Gateway.
        </div>
      </div>
    </div>
  );
}
