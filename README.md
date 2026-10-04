<div align="center">

# 🏛️ MITE Contineo — Enhanced Collegiate Student Portal

**A modernized, AI-augmented student portal reimagined for Mangalore Institute of Technology & Engineering (MITE)**  
*Eliminating academic ERP friction with instant attendance calculators, interactive timetables, IA marks analytics, and a campus Gemini AI assistant.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite 6](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Copilot-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

Collegiate Enterprise Resource Planning (ERP) portals are often cumbersome, difficult to navigate on mobile devices, and slow to deliver critical daily information. 

**MITE Contineo Enhanced** is a comprehensive student-centric reimagination engineered specifically for students at **Mangalore Institute of Technology & Engineering (MITE)**. Built from the ground up with **React 19**, **TypeScript**, and **Tailwind CSS**, it brings a lightning-fast native web feel, real-time attendance margin calculations, intuitive timetable navigation, and an intelligent **Google Gemini AI** academic assistant.

---

## ✨ Core Modules & Features

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    MITE CONTINEO — ENHANCED ARCHITECTURE                   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
   ┌───────────────┬──────────────────┼──────────────────┬───────────────┐
   ▼               ▼                  ▼                  ▼               ▼
┌──────────────┐ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ ┌──────────────┐
│  DASHBOARD   │ │  ATTENDANCE  │  │  TIMETABLE   │  │  IA MARKS    │ │  AI ASSIST   │
├──────────────┤ ├──────────────┤  ├──────────────┤  ├──────────────┤ ├──────────────┤
│ CGPA / SGPA  │ │ 75% Cutoff   │  │ Daily Schedule│ │ IA-1, IA-2   │ │ Gemini Bot   │
│ Fast Alerts  │ │ Safe Margin  │  │ Room Numbers │  │ Trajectory   │ │ Exam FAQs    │
│ Class Feed   │ │ Class Delta  │  │ Active Period│  │ Assignment   │ │ Regulations  │
└──────────────┘ └──────────────┘  └──────────────┘  └──────────────┘ └──────────────┘
```

### 📊 1. Executive Student Dashboard (`src/components/Dashboard.tsx`)
- **Key Academic Metrics:** Instant snapshot of current CGPA, semester SGPA, and cumulative attendance.
- **Urgent Notifications:** Highlights pending fees, upcoming tests, and immediate attendance warnings.
- **Today's Class Schedule:** Real-time indicator displaying ongoing lectures and upcoming laboratory sessions.

### 📈 2. Intelligent Attendance Margin Calculator (`src/components/AttendanceTracker.tsx`)
- **Visual Circular Progress:** Real-time color-coded radial gauges displaying attendance per subject.
- **Safe Margin Bunk Calculator:** Shows exactly how many classes you can afford to miss while remaining above the mandatory 75% or 85% attendance requirement.
- **Recovery Planner:** Calculates the exact number of consecutive upcoming classes you must attend to recover from attendance shortages.

### 📅 3. Interactive Timetable & Classroom Navigator (`src/components/Timetable.tsx`)
- **Weekly Schedule Grid:** Filter lectures by day with clear timing breakdowns and faculty assignments.
- **Active Period Highlighter:** Automatically pinpoints your current classroom and lecture based on real-time clock.

### 🎯 4. Marks & IA Trajectory Manager (`src/components/MarksManager.tsx`)
- **Internal Assessments:** Clean tracking of IA-1, IA-2, and IA-3 marks out of 50.
- **Laboratory & Assignment Records:** Lab record evaluations and continuous internal assessment (CIE) breakdowns.
- **Target Projection:** Helps students calculate marks required on subsequent tests to maintain eligibility thresholds.

### 💳 5. Fees & Dues Center (`src/components/FeesCenter.tsx`)
- **Transparent Ledger:** Complete breakdown of college tuition, hostel fees, and laboratory charges.
- **Receipt Archives:** Download and view digital transaction histories and clearance slips.

### 👨‍🏫 6. Proctor & Mentor Portal (`src/components/MentorPortal.tsx`)
- **Counseling Logs:** View notes, faculty proctor feedback, and academic advisory remarks.
- **Direct Faculty Communication:** Streamlined notes channel between students and designated mentors.

### 📢 7. Digital Notice Board & Circulars (`src/components/Circulars.tsx`)
- **Centralized Circulars:** Direct access to official VTU university guidelines, college events, and semester examination circulars.

### 🤖 8. Gemini AI Academic Copilot
- **Smart Campus Assistant:** Powered by `@google/genai` to immediately answer student questions regarding academic calendars, grading criteria, syllabus topics, and campus logistics.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6
- **Styling & Animation:** Tailwind CSS v4, Motion (Framer Motion)
- **Icons:** Lucide React
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Backend / Mock API:** Express 4, Node.js

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/shubhamkerure07/mite-contineo-webs-enhanced-version.git
cd mite-contineo-webs-enhanced-version

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Copy .env.example to .env and configure your Google Gemini API key:
# GEMINI_API_KEY=your_gemini_api_key_here

# 4. Start local development server
npm run dev
```

The portal will launch at `http://localhost:3000`.

### Production Build

```bash
# Type check and build optimized static assets
npm run build

# Preview production build locally
npm run preview
```

---

## 👨‍💻 Author

**Shubham Kerure**  
*Mechatronics Engineering Student @ Mangalore Institute of Technology & Engineering (MITE)*  
- **GitHub:** [@shubhamkerure07](https://github.com/shubhamkerure07)  
- **Portfolio:** [portfolio-lac-two-76.vercel.app](https://portfolio-lac-two-76.vercel.app/)  
- **LinkedIn:** [Shubham Kerure](https://www.linkedin.com/in/shubham-kerure-23350938b)  
- **Email:** [shubhamkerure13@gmail.com](mailto:shubhamkerure13@gmail.com)

---

<div align="center">
<sub>Designed & Engineered for MITE Students • Licensed under MIT</sub>
</div>