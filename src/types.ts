/**
 * Types representing the MITE Student & Parent Portal Academic Companion
 */

export interface SubjectAttendance {
  code: string;
  name: string;
  instructor: string;
  conducted: number;
  attended: number;
  type: 'Theory' | 'Lab';
}

export interface SubjectMarks {
  code: string;
  name: string;
  ia1: number | null; // out of 30 or 40. Typically and usually, VTU CIE is 50 marks total. Let's do 40 marks for IA and 10 marks for assignment/quiz.
  ia2: number | null;
  ia3: number | null;
  assignment: number | null; // out of 10
  labRecord?: number | null; // out of 20 for Labs
  labViva?: number | null; // out of 10 for Labs
  cieTotal: number; // calculated out of 50
  seePredicted?: number; // predicted Semester End Exam marks out of 100 (which scales to 50)
}

export interface StudentProfile {
  name: string;
  usn: string;
  email: string;
  mobile: string;
  parentName: string;
  parentMobile: string;
  branch: string;
  semester: number;
  section: string;
  mentorName: string;
  mentorEmail: string;
  mentorMobile: string;
  cgpa: number;
}

export interface FeeItem {
  id: string;
  category: string;
  total: number;
  paid: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending';
}

export interface TimetablePeriod {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  time: string;
  subjectCode: string;
  subjectName: string;
  room: string;
}

export interface AcademicCircular {
  id: string;
  date: string;
  title: string;
  category: 'Exam' | 'Academic' | 'Fees' | 'General' | 'Placement';
  content: string;
  isUrgent: boolean;
}

export interface MentorMessage {
  id: string;
  sender: 'Mentor' | 'Parent';
  timestamp: string;
  message: string;
  isRead: boolean;
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}
