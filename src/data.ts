import { StudentProfile, SubjectAttendance, SubjectMarks, FeeItem, TimetablePeriod, AcademicCircular, MentorMessage, LeaveRequest } from './types';

// Standard mock student data representing a CSE Student at MITE
export const defaultProfile: StudentProfile = {
  name: 'Suhas K. Rao',
  usn: '4MT22CS148',
  email: 'suhas.rao22@mite.ac.in',
  mobile: '+91 98452 73210',
  parentName: 'Krishnamurthy Rao',
  parentMobile: '+91 94481 05612',
  branch: 'Computer Science & Engineering',
  semester: 6,
  section: 'B-Section',
  mentorName: 'Dr. Sandeep Kumar',
  mentorEmail: 'sandeepkumar@mite.ac.in',
  mentorMobile: '+91 98765 43210',
  cgpa: 8.42
};

// Subject Attendance defaults
export const defaultAttendance: SubjectAttendance[] = [
  { code: '21CS61', name: 'Software Engineering & Project Management', instructor: 'Prof. Divya Hegde', conducted: 40, attended: 36, type: 'Theory' },
  { code: '21CS62', name: 'Full Stack Development (Web Tech)', instructor: 'Dr. Sandeep Kumar', conducted: 45, attended: 41, type: 'Theory' },
  { code: '21CS63', name: 'Computer Graphics & Image Processing', instructor: 'Prof. Ramesh Bhat', conducted: 38, attended: 28, type: 'Theory' }, // 73.6% - Shortage flag!
  { code: '21CS64', name: 'Cryptography & Network Security', instructor: 'Dr. Anand S. Kamath', conducted: 42, attended: 37, type: 'Theory' },
  { code: '21CS65', name: 'Cloud Computing & Virtualization', instructor: 'Prof. Smitha Shetty', conducted: 35, attended: 31, type: 'Theory' },
  { code: '21CSL66', name: 'FSD Web Technology Laboratory', instructor: 'Dr. Sandeep Kumar & Lab Staff', conducted: 12, attended: 12, type: 'Lab' },
  { code: '21CSL67', name: 'Computer Graphics & CGIP Laboratory', instructor: 'Prof. Ramesh Bhat', conducted: 10, attended: 9, type: 'Lab' }
];

// Subject CIE Marks defaults
// Note: VTU Internal Evaluation consists of 3 IAs (max 40 scaled), plus assignments (max 10), summing to 50 CIE marks
export const defaultMarks: SubjectMarks[] = [
  { code: '21CS61', name: 'Software Engineering & Project Management', ia1: 34, ia2: 36, ia3: 31, assignment: 9, cieTotal: 44, seePredicted: 82 },
  { code: '21CS62', name: 'Full Stack Development (Web Tech)', ia1: 38, ia2: 39, ia3: 35, assignment: 10, cieTotal: 49, seePredicted: 88 },
  { code: '21CS63', name: 'Computer Graphics & Image Processing', ia1: 26, ia2: 24, ia3: 28, assignment: 8, cieTotal: 35, seePredicted: 70 },
  { code: '21CS64', name: 'Cryptography & Network Security', ia1: 32, ia2: 29, ia3: 34, assignment: 9, cieTotal: 42, seePredicted: 75 },
  { code: '21CS65', name: 'Cloud Computing & Virtualization', ia1: 30, ia2: 32, ia3: null, assignment: 8, cieTotal: 39, seePredicted: 78 },
  { code: '21CSL66', name: 'FSD Web Technology Laboratory', ia1: 36, ia2: null, ia3: null, assignment: 10, cieTotal: 46, seePredicted: 90 },
  { code: '21CSL67', name: 'Computer Graphics & CGIP Laboratory', ia1: 32, ia2: null, ia3: null, assignment: 9, cieTotal: 41, seePredicted: 80 }
];

// Fee schedule defaults
export const defaultFees: FeeItem[] = [
  { id: 'fee-01', category: 'Tuition Fee (MITE)', total: 125000, paid: 125000, dueDate: '2026-08-15', status: 'Paid' },
  { id: 'fee-02', category: 'VTU Registration & Exam Fee', total: 4500, paid: 4500, dueDate: '2026-09-30', status: 'Paid' },
  { id: 'fee-03', category: 'MITE Bus Transport Fee (Route: Mangalore)', total: 24000, paid: 12000, dueDate: '2026-10-15', status: 'Partial' },
  { id: 'fee-04', category: 'Skill Development & Lab Maintenance', total: 15000, paid: 0, dueDate: '2026-11-30', status: 'Pending' }
];

// Timetable schedule defaults
export const defaultTimetable: TimetablePeriod[] = [
  // Monday
  { day: 'Monday', period: 1, time: '09:00 AM - 09:55 AM', subjectCode: '21CS61', subjectName: 'Software Engineering', room: 'LHC-204' },
  { day: 'Monday', period: 2, time: '09:55 AM - 10:50 AM', subjectCode: '21CS62', subjectName: 'Full Stack Development', room: 'LHC-204' },
  { day: 'Monday', period: 3, time: '11:10 AM - 12:05 PM', subjectCode: '21CS64', subjectName: 'Cryptography', room: 'LHC-204' },
  { day: 'Monday', period: 4, time: '12:05 PM - 01:00 PM', subjectCode: '21CS65', subjectName: 'Cloud Computing', room: 'LHC-301' },
  { day: 'Monday', period: 5, time: '01:55 PM - 02:50 PM', subjectCode: '21CS63', subjectName: 'Computer Graphics', room: 'LHC-204' },
  { day: 'Monday', period: 6, time: '02:50 PM - 03:45 PM', subjectCode: 'Counseling', subjectName: 'Counseling Session / Seminar', room: 'Seminar Hall 1' },

  // Tuesday
  { day: 'Tuesday', period: 1, time: '09:00 AM - 09:55 AM', subjectCode: '21CS63', subjectName: 'Computer Graphics', room: 'LHC-204' },
  { day: 'Tuesday', period: 2, time: '09:55 AM - 10:50 AM', subjectCode: '21CS64', subjectName: 'Cryptography', room: 'LHC-204' },
  { day: 'Tuesday', period: 3, time: '11:10 AM - 12:05 PM', subjectCode: '21CS61', subjectName: 'Software Engineering', room: 'LHC-210' },
  { day: 'Tuesday', period: 4, time: '12:05 PM - 01:00 PM', subjectCode: '21CS62', subjectName: 'Full Stack Development', room: 'LHC-204' },
  { day: 'Tuesday', period: 5, time: '01:55 PM - 04:40 PM', subjectCode: '21CSL66', subjectName: 'FSD Web Technology Lab', room: 'CSE Lab 4 (M block)' },

  // Wednesday
  { day: 'Wednesday', period: 1, time: '09:00 AM - 09:55 AM', subjectCode: '21CS65', subjectName: 'Cloud Computing', room: 'LHC-301' },
  { day: 'Wednesday', period: 2, time: '09:55 AM - 10:50 AM', subjectCode: '21CS61', subjectName: 'Software Engineering', room: 'LHC-204' },
  { day: 'Wednesday', period: 3, time: '11:10 AM - 12:05 PM', subjectCode: '21CS62', subjectName: 'Full Stack Development', room: 'LHC-204' },
  { day: 'Wednesday', period: 4, time: '12:05 PM - 01:00 PM', subjectCode: '21CS63', subjectName: 'Computer Graphics', room: 'LHC-210' },
  { day: 'Wednesday', period: 5, time: '01:55 PM - 02:50 PM', subjectCode: 'Library', subjectName: 'Technical Seminar', room: 'M-Block Auditorium' },
  { day: 'Wednesday', period: 6, time: '02:50 PM - 03:45 PM', subjectCode: 'Placement', subjectName: 'Placement Aptitude Training', room: 'MBA Hall 2' },

  // Thursday
  { day: 'Thursday', period: 1, time: '09:00 AM - 09:55 AM', subjectCode: '21CS64', subjectName: 'Cryptography', room: 'LHC-204' },
  { day: 'Thursday', period: 2, time: '09:55 AM - 10:50 AM', subjectCode: '21CS65', subjectName: 'Cloud Computing', room: 'LHC-301' },
  { day: 'Thursday', period: 3, time: '11:10 AM - 12:05 PM', subjectCode: '21CS63', subjectName: 'Computer Graphics', room: 'LHC-204' },
  { day: 'Thursday', period: 4, time: '12:05 PM - 01:00 PM', subjectCode: '21CS61', subjectName: 'Software Engineering', room: 'LHC-204' },
  { day: 'Thursday', period: 5, time: '01:55 PM - 04:40 PM', subjectCode: '21CSL67', subjectName: 'Computer Graphics Lab (CGIP)', room: 'M-Block Lab 3' },

  // Friday
  { day: 'Friday', period: 1, time: '09:00 AM - 09:55 AM', subjectCode: '21CS62', subjectName: 'Full Stack Development', room: 'LHC-204' },
  { day: 'Friday', period: 2, time: '09:55 AM - 10:50 AM', subjectCode: '21CS64', subjectName: 'Cryptography', room: 'LHC-204' },
  { day: 'Friday', period: 3, time: '11:10 AM - 12:05 PM', subjectCode: '21CS65', subjectName: 'Cloud Computing', room: 'LHC-301' },
  { day: 'Friday', period: 4, time: '12:05 PM - 01:00 PM', subjectCode: '21CS63', subjectName: 'Computer Graphics', room: 'LHC-204' },
  { day: 'Friday', period: 5, time: '01:55 PM - 02:50 PM', subjectCode: 'Activity', subjectName: 'E-Cell / Co-curricular Activities', room: 'Seminar Hall 3' },
  { day: 'Friday', period: 6, time: '02:50 PM - 03:45 PM', subjectCode: 'Sports', subjectName: 'Physical Education / Remedial', room: 'Playground / Classroom' },

  // Saturday (Half day)
  { day: 'Saturday', period: 1, time: '09:00 AM - 09:55 AM', subjectCode: '21CS61', subjectName: 'Software Engineering', room: 'LHC-204' },
  { day: 'Saturday', period: 2, time: '09:55 AM - 10:50 AM', subjectCode: '21CS62', subjectName: 'Full Stack Development', room: 'LHC-204' },
  { day: 'Saturday', period: 3, time: '11:10 AM - 12:05 PM', subjectCode: 'Mentoring', subjectName: 'Weekly Mentor-Student Review', room: 'Cabin LHC-204A' },
  { day: 'Saturday', period: 4, time: '12:05 PM - 01:00 PM', subjectCode: 'VTU', subjectName: 'VTU Open Elective / General Seminar', room: 'Seminar Hall 1' }
];

// Academic Circulars defaults
export const defaultCirculars: AcademicCircular[] = [
  {
    id: 'circ-01',
    date: '2026-06-10',
    title: 'Commencement of CIE-3 Exams',
    category: 'Exam',
    content: 'The 3rd Continuous Internal Evaluation (CIE-3) for the 4th and 6th semester BE students will commence on June 22, 2026. The detailed timetable is displayed on the department notice board. 85% attendance is mandatory to sit for the exams.',
    isUrgent: true
  },
  {
    id: 'circ-02',
    date: '2026-06-08',
    title: 'Bus Fee Pending Balance Notification',
    category: 'Fees',
    content: 'All parents using the college bus transport system are requested to clear any pending Bus Fee installment on or before June 20, 2026 to avoid seat cancellation. Challans can be generated online via the portal.',
    isUrgent: false
  },
  {
    id: 'circ-03',
    date: '2026-06-03',
    title: 'VTU Examination Registration Extension',
    category: 'Exam',
    content: 'This is to inform that VTU has extended the online exam registration for even semesters till June 18 without fine. Students must get clear bills from accounts and update credentials.',
    isUrgent: true
  },
  {
    id: 'circ-04',
    date: '2026-05-28',
    title: 'MITE Annual Mega Placement Drive',
    category: 'Placement',
    content: 'Multiple global tech organizations (including Bosch, TCS, Cognizant, and Wipro) are visiting MITE for campus hiring next month. Full schedule of mock interviews and aptitude refreshers begins June 15.',
    isUrgent: false
  },
  {
    id: 'circ-05',
    date: '2026-05-15',
    title: 'Project Exhibition / Sentia Fest Accolades',
    category: 'General',
    content: 'Congratulations to the CSE and ISE final year batches on winning the State High Rank project rewards. MITE highlights our innovation focus! Weekly project templates have been uploaded in the main library database.',
    isUrgent: false
  }
];

// Mentor-Parent Messaging chats default
export const defaultMessages: MentorMessage[] = [
  { id: 'msg-01', sender: 'Mentor', timestamp: '2026-06-01 10:30 AM', message: 'Hello Mr. Rao. I wanted to draw your attention to Suhas\'s attendance in Computer Graphics (21CS63). It is currently 73.6%, which is below the VTU-restricted 75%. Please advice him to attend all upcoming classes.', isRead: true },
  { id: 'msg-02', sender: 'Parent', timestamp: '2026-06-02 02:15 PM', message: 'Thank you for updating me, Dr. Sandeep. I will speak to him tonight and ensure he coordinates with Prof. Ramesh Bhat to attend extra classes. How is his performance in IA-1 and IA-2?', isRead: true },
  { id: 'msg-03', sender: 'Mentor', timestamp: '2026-06-03 09:12 AM', message: 'He is doing exceptionally well otherwise! He scored 38/40 in Web Tech and 34/40 in Software Engineering. Computer Graphics is a bit lower (26/40), so a bit more attention there will secure him a very high SGPA.', isRead: true },
  { id: 'msg-04', sender: 'Parent', timestamp: '2026-06-03 11:30 AM', message: 'That is reassuring. I have instructed him to show me his CIE-3 scores as well. I will monitor his daily login too.', isRead: true },
];

export const defaultLeaves: LeaveRequest[] = [
  { id: 'lv-01', startDate: '2026-05-10', endDate: '2026-05-11', reason: 'Severe Viral Fever (Medical certificate submitted to HOD)', status: 'Approved', appliedOn: '2026-05-09' },
  { id: 'lv-02', startDate: '2026-06-18', endDate: '2026-06-19', reason: 'Family Religious Ceremony in Udupi', status: 'Pending', appliedOn: '2026-06-11' }
];

export const mockUndeclaredStudents = [
  { usn: '4MT22CS148', name: 'Suhas K. Rao', dob: '2004-08-15', phone: '9448105612' },
  { usn: '4MT22CS010', name: 'Apoorva S. Shetty', dob: '2004-03-24', phone: '9844012345' },
  { usn: '4MT22CS082', name: 'Mohit Nayak', dob: '2004-11-02', phone: '9123456789' }
];
