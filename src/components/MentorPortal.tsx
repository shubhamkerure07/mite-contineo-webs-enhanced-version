import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  MessageSquare, 
  Send, 
  FileText, 
  CheckCircle, 
  Calendar, 
  Plus, 
  Clock, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { MentorMessage, LeaveRequest, StudentProfile } from '../types';

interface MentorPortalProps {
  initialMessages: MentorMessage[];
  initialLeaves: LeaveRequest[];
  profile: StudentProfile;
  onSaveMessages: (updated: MentorMessage[]) => void;
  onSaveLeaves: (updated: LeaveRequest[]) => void;
}

export default function MentorPortal({
  initialMessages,
  initialLeaves,
  profile,
  onSaveMessages,
  onSaveLeaves
}: MentorPortalProps) {
  const [messages, setMessages] = useState<MentorMessage[]>(JSON.parse(JSON.stringify(initialMessages)));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(JSON.parse(JSON.stringify(initialLeaves)));
  
  const [typedMessage, setTypedMessage] = useState('');
  const [isCounselorTyping, setIsCounselorTyping] = useState(false);

  // Leave Form States
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveSuccessMsg, setLeaveSuccessMsg] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg: MentorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Parent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      message: typedMessage.trim(),
      isRead: true
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    onSaveMessages(updated);
    const question = typedMessage.toLowerCase();
    setTypedMessage('');

    // Simulate Advisor Reply
    setIsCounselorTyping(true);
    setTimeout(() => {
      let replyText = `Hello. Thank you for your message. I am currently reviewing ${profile.name}'s weekly attendance records. If you have any queries about CGIP (21CS63) classes conducted, I'll request Prof. Ramesh Bhat to evaluate his remedial file.`;
      
      if (question.includes('leave') || question.includes('sick') || question.includes('absence')) {
        replyText = `Thank you for the notification regarding his leave model. Please make sure to upload the formal medical slip or certificate via our Leave Submission Panel below, and I will endorse it for HOD approval promptly.`;
      } else if (question.includes('mark') || question.includes('ia') || question.includes('cie') || question.includes('score')) {
        replyText = `Suhas has shown great focus in his Full Stack Web Development (21CS62) labs. His performance is consistent. For his upcoming CIE-3 tests, completing the previous year VTU questions is highly advised.`;
      } else if (question.includes('fee') || question.includes('installment') || question.includes('bus')) {
        replyText = `For accounts disputes or Bus Fee clearance, you can securely execute payments online. Once the transaction completes, the system updates immediately. I have notified our department accounts desk.`;
      }

      const replyMsg: MentorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'Mentor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
        message: replyText,
        isRead: false
      };

      const finalMessages = [...updated, replyMsg];
      setMessages(finalMessages);
      onSaveMessages(finalMessages);
      setIsCounselorTyping(false);
    }, 1500);
  };

  const submitLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;

    const newLeave: LeaveRequest = {
      id: `lv-${Date.now()}`,
      startDate,
      endDate,
      reason: reason.trim(),
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    const updated = [newLeave, ...leaves];
    setLeaves(updated);
    onSaveLeaves(updated);

    // Reset Form
    setStartDate('');
    setEndDate('');
    setReason('');
    setShowLeaveForm(false);
    setLeaveSuccessMsg(true);
    setTimeout(() => setLeaveSuccessMsg(false), 3000);
  };

  const quickActionLeaveApprove = (id: string) => {
    const updated = leaves.map(lv => {
      if (lv.id === id) {
        return { ...lv, status: 'Approved' as const };
      }
      return lv;
    });
    setLeaves(updated);
    onSaveLeaves(updated);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <User className="h-5.5 w-5.5 text-blue-600" /> Counselor-Parent Mentor Hub
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Maintain bidirectional communications with {profile.name}&apos;s assigned student advisor, Dr. Sandeep Kumar.
          </p>
        </div>
        <div className="bg-teal-50 text-teal-800 border border-teal-100 rounded-xl px-3.5 py-1.5 text-xs font-bold leading-none select-none">
          Active Counselor Advisor: {profile.mentorName}
        </div>
      </div>

      {/* Main Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Instant Mentor Chat Bot Simulation */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col h-[520px]">
          
          {/* Chat header panel */}
          <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/50 rounded-t-2xl">
            <div className="h-10 w-10 bg-blue-100 text-blue-800 flex items-center justify-center font-black rounded-full border border-blue-200">
              DS
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-800 block">{profile.mentorName}</span>
              <span className="text-[10px] text-slate-400 font-bold block">Senior Professor, Department of CSE</span>
            </div>
          </div>

          {/* Active dialogue logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m) => {
              const isMentor = m.sender === 'Mentor';
              return (
                <div key={m.id} className={`flex ${isMentor ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isMentor 
                      ? 'bg-slate-100 text-slate-800 rounded-tl-none' 
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    <p className="font-semibold">{m.message}</p>
                    <span className={`block text-[9px] mt-1.5 ${isMentor ? 'text-slate-400' : 'text-blue-200'} font-bold`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isCounselorTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5 text-xs font-semibold">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                  <span>Advisor is responding...</span>
                </div>
              </div>
            )}
          </div>

          {/* Type form */}
          <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              required
              placeholder="Ask Dr. Sandeep (e.g. Leave clearance, IA marks...)"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="flex-1 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 font-semibold"
            />
            <button
              type="submit"
              className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-50 cursor-pointer"
              id="btn-mentor-chat-send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>

        {/* Right Column: Leave Submissions Panel */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                  Student Leave Logs
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Formally request academic absence endorse approvals</p>
              </div>
              
              <button
                onClick={() => setShowLeaveForm(!showLeaveForm)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                id="btn-toggle-leave-form"
              >
                <Plus className="h-3.5 w-3.5" /> New Application
              </button>
            </div>

            {leaveSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Absence request submitted! Retained in student ledger as pending counselor check.</span>
              </div>
            )}

            {showLeaveForm && (
              <form onSubmit={submitLeaveRequest} className="bg-slate-50 border border-slate-150 p-4 rounded-xl mb-4 space-y-3.5 transition-all">
                <span className="text-[10px] font-black uppercase text-slate-400 block pb-1 border-b border-slate-200">Submit formal leave card</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-slate-600 block">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-bold text-slate-600 block">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-slate-600 block">Reason of Absence</label>
                  <textarea
                    required
                    placeholder="Provide explanatory description..."
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="block w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 font-medium"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setShowLeaveForm(false)}
                    className="px-3 py-1.5 hover:bg-slate-200 border border-slate-250 rounded-lg font-bold text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold cursor-pointer"
                    id="btn-submit-leave-form"
                  >
                    Send to Advisor
                  </button>
                </div>
              </form>
            )}

            {/* List Leaves */}
            <div className="space-y-3.5 max-h-[350px] overflow-y-auto">
              {leaves.map((lv) => (
                <div key={lv.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-800 leading-none">Reason: {lv.reason}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        lv.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {lv.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                      <Calendar className="w-3 h-3 text-slate-350" />
                      <span>{lv.startDate} to {lv.endDate}</span>
                      <span>• Applied: {lv.appliedOn}</span>
                    </div>
                  </div>

                  {lv.status === 'Pending' && (
                    <button
                      onClick={() => quickActionLeaveApprove(lv.id)}
                      className="text-[10px] px-2.5 py-1.5 bg-emerald-100 border border-emerald-250 text-emerald-800 font-bold rounded-lg cursor-pointer hover:bg-emerald-200 transition-colors shrink-0"
                    >
                      Process Approval
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
