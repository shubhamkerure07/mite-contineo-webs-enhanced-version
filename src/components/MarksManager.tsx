import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  BookOpen, 
  Calculator, 
  HelpCircle, 
  RefreshCw, 
  Save, 
  Sliders, 
  TrendingUp, 
  AlertCircle,
  HelpCircle as CheckCircle,
  Percent
} from 'lucide-react';
import { SubjectMarks } from '../types';

interface MarksManagerProps {
  initialMarks: SubjectMarks[];
  onSave: (updated: SubjectMarks[]) => void;
}

export default function MarksManager({ initialMarks, onSave }: MarksManagerProps) {
  const [marks, setMarks] = useState<SubjectMarks[]>(JSON.parse(JSON.stringify(initialMarks)));
  const [activeTab, setActiveTab] = useState<string>(marks[0]?.code || '');
  const [successMsg, setSuccessMsg] = useState(false);

  // Active subject
  const activeSub = marks.find(m => m.code === activeTab) || marks[0];

  // Helper: Calculate CIE with Best 2 of 3 IA rules
  const calculateCieForSubject = (
    ia1: number | null, 
    ia2: number | null, 
    ia3: number | null, 
    assignment: number | null
  ) => {
    const scores = [ia1 ?? 0, ia2 ?? 0, ia3 ?? 0].sort((a, b) => b - a); // descending order
    
    // Average of best two
    const bestTwoAvg = (scores[0] + scores[1]) / 2;
    
    // Rounded score out of 40
    const scaledIa = Math.round(bestTwoAvg);
    
    // Assignment out of 10
    const assignScore = assignment ?? 0;
    
    return Math.min(50, scaledIa + assignScore);
  };

  const updateIndividualMark = (
    code: string, 
    field: 'ia1' | 'ia2' | 'ia3' | 'assignment' | 'seePredicted', 
    val: string
  ) => {
    setMarks(prev => prev.map(m => {
      if (m.code === code) {
        const item = { ...m };
        const numVal = val === '' ? null : Math.max(0, parseInt(val) || 0);

        if (field === 'assignment') {
          item.assignment = numVal !== null ? Math.min(10, numVal) : null;
        } else if (field === 'seePredicted') {
          item.seePredicted = numVal !== null ? Math.min(100, numVal) : 70;
        } else {
          // IAs are out of 40
          item[field] = numVal !== null ? Math.min(40, numVal) : null;
        }

        // Recalculate CIE total
        item.cieTotal = calculateCieForSubject(item.ia1, item.ia2, item.ia3, item.assignment);
        return item;
      }
      return m;
    }));
  };

  const getVtuGrade = (cie: number, see: number) => {
    // Joint Total: CIE (out of 50) + finalSEE scaled to 50 (see / 2)
    // To pass: must have SEE >= 35, and total >= 40
    if (see < 35) return { grade: 'F', label: 'Fail (SEE < 35%)', color: 'text-red-650' };
    
    const total = cie + (see / 2);
    if (total < 40) return { grade: 'F', label: 'Fail (Aggregate < 40)', color: 'text-red-650' };
    if (total >= 90) return { grade: 'S', label: 'S (Outstanding)', color: 'text-emerald-600 font-black' };
    if (total >= 80) return { grade: 'A', label: 'A (Excellent)', color: 'text-blue-600 font-bold' };
    if (total >= 70) return { grade: 'B', label: 'B (Very Good)', color: 'text-indigo-600 font-bold' };
    if (total >= 60) return { grade: 'C', label: 'C (Good)', color: 'text-slate-700 font-semibold' };
    if (total >= 50) return { grade: 'D', label: 'D (Above Average)', color: 'text-slate-650' };
    return { grade: 'E', label: 'E (Pass)', color: 'text-slate-500' };
  };

  // Calculate SGPA for current simulated scores
  // VTU Grade Points: S=10, A=9, B=8, C=7, D=6, E=4, F=0
  const predictSgpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    marks.forEach(m => {
      const predSee = m.seePredicted || 70;
      const gObj = getVtuGrade(m.cieTotal, predSee);
      const isLab = m.name.toLowerCase().includes('laboratory') || m.name.toLowerCase().includes('lab');
      const credits = isLab ? 1.5 : 3.0; // Typical VTU course credits
      
      let pts = 0;
      if (gObj.grade === 'S') pts = 10;
      else if (gObj.grade === 'A') pts = 9;
      else if (gObj.grade === 'B') pts = 8;
      else if (gObj.grade === 'C') pts = 7;
      else if (gObj.grade === 'D') pts = 6;
      else if (gObj.grade === 'E') pts = 4;
      
      totalPoints += pts * credits;
      totalCredits += credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  };

  // Find SEE score needed to get a target total score
  const getRequiredSeeMarks = (cie: number, targetTotal: number) => {
    // total = cie + see/2  ==> see = (targetTotal - cie) * 2;
    const needed = (targetTotal - cie) * 2;
    if (needed <= 35) return 35; // Must score at least pass limit of 35% in final
    if (needed > 100) return -1; // Impossible
    return needed;
  };

  const handleResetMarks = () => {
    setMarks(JSON.parse(JSON.stringify(initialMarks)));
    setSuccessMsg(false);
  };

  const handleSaveMarks = () => {
    onSave(marks);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  // Simulated Grade outcomes
  const activePredSee = activeSub?.seePredicted || 70;
  const activeGradeObj = getVtuGrade(activeSub?.cieTotal, activePredSee);
  const activeAggregate = activeSub?.cieTotal + (activePredSee / 2);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top action header bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Calculator className="h-5.5 w-5.5 text-blue-600" /> VTU Internals & Grade Predictor
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Replicates MITE's Best 2 out of 3 IA scaling algorithm. Simulate Semester End Examinations (SEE) to project your overall GPA.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetMarks}
            className="px-3.5 py-2 hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Revert Marks
          </button>
          <button
            onClick={handleSaveMarks}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Save className="h-3.5 w-3.5" /> Save Mark Sheet
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-medium animate-fadeIn">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Scores locally persisted on simulated client database! Overall SGPA re-estimated in student details.</span>
        </div>
      )}

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Hand: Subject Navigation Menu & Overall GPA Predictor Card */}
        <div className="space-y-6">
          
          {/* Estimated SGPA Result Display */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg border border-slate-800 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-950 border border-indigo-900/50 px-2 py-0.5 rounded-sm">
                Predicted SGPA
              </span>
              <BookOpen className="h-5 w-5 text-indigo-400" />
            </div>
            
            <div className="my-1.5 text-center">
              <span className="text-5xl font-black text-amber-300 drop-shadow-xs">
                {predictSgpa().toFixed(2)}
              </span>
              <span className="block text-xs text-slate-400 font-medium mt-1">out of 10.00 Semester GPA</span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span>Completed Credits:</span>
                <span className="font-bold text-white">18.0 Credits</span>
              </div>
              <div className="flex justify-between">
                <span>Passing Grade:</span>
                <span className="font-bold text-emerald-400">All Modules Passing</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Calculated using VTU credit-weight system (Theory: 3, Lab: 1.5). Updates instantly as you fine-tune exam grades.
              </p>
            </div>
          </div>

          {/* Quick Subject Tabs selector list */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-1">
              Select Subject
            </h3>
            <div className="space-y-1">
              {marks.map((m) => {
                const isSelected = m.code === activeTab;
                return (
                  <button
                    key={m.code}
                    onClick={() => setActiveTab(m.code)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="max-w-[190px] truncate">
                      <span className={`block font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {m.name}
                      </span>
                      <span className={`text-[10px] font-mono block ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        {m.code}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      isSelected 
                        ? 'bg-white/10 text-white' 
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}>
                      {m.cieTotal} CIE
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Hand: Deep Subject Marks Tuning & SEE Grade Matrix simulation */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeSub ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
              
              {/* Active Subject Primary Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-blue-600 bg-blue-50 font-bold px-2 py-0.5 rounded-sm">
                      {activeSub.code}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• Core Course</span>
                  </div>
                  <h3 className="font-black text-slate-800 text-lg sm:text-xl mt-1">
                    {activeSub.name}
                  </h3>
                </div>
                <div className="text-right self-start sm:self-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">CIE Result</span>
                  <span className="text-3xl font-black text-blue-600">
                    {activeSub.cieTotal} <span className="text-sm text-slate-400 font-medium">/ 50</span>
                  </span>
                </div>
              </div>

              {/* VTU Rule Banner Explainer */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800 leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block mb-0.5">MITE / VTU Scaling Algorithm Standard</span>
                  Your top two (2) scores among IA-1, IA-2, and IA-3 are averaged to scale your score out of 40. 
                  This is combined with Assignment/Quiz scores (max 10) to generate the final Continuous Internal Evaluation (CIE) out of 50.
                </div>
              </div>

              {/* Marks Editing Formulation */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Continuous Internal Evaluation (CIE) Parameters
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  {/* IA1 input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Assessment IA-1</label>
                    <div className="relative">
                      <input
                        type="number"
                        max={40}
                        min={0}
                        placeholder="N/A"
                        value={activeSub.ia1 === null ? '' : activeSub.ia1}
                        onChange={(e) => updateIndividualMark(activeSub.code, 'ia1', e.target.value)}
                        className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                      <span className="absolute right-3.5 top-2.5 text-[10px] font-bold text-slate-400">/40</span>
                    </div>
                  </div>

                  {/* IA2 input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Assessment IA-2</label>
                    <div className="relative">
                      <input
                        type="number"
                        max={40}
                        min={0}
                        placeholder="N/A"
                        value={activeSub.ia2 === null ? '' : activeSub.ia2}
                        onChange={(e) => updateIndividualMark(activeSub.code, 'ia2', e.target.value)}
                        className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                      <span className="absolute right-3.5 top-2.5 text-[10px] font-bold text-slate-400">/40</span>
                    </div>
                  </div>

                  {/* IA3 input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Assessment IA-3</label>
                    <div className="relative">
                      <input
                        type="number"
                        max={40}
                        min={0}
                        placeholder="N/A"
                        value={activeSub.ia3 === null ? '' : activeSub.ia3}
                        onChange={(e) => updateIndividualMark(activeSub.code, 'ia3', e.target.value)}
                        className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                      <span className="absolute right-3.5 top-2.5 text-[10px] font-bold text-slate-400">/40</span>
                    </div>
                  </div>

                  {/* Assignment input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Assignment / Quiz</label>
                    <div className="relative">
                      <input
                        type="number"
                        max={10}
                        min={0}
                        placeholder="N/A"
                        value={activeSub.assignment === null ? '' : activeSub.assignment}
                        onChange={(e) => updateIndividualMark(activeSub.code, 'assignment', e.target.value)}
                        className="block w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                      <span className="absolute right-3.5 top-2.5 text-[10px] font-bold text-slate-400">/10</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* SEE Predictor segment */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Simulate Semester End Examinations (SEE)
                  </h4>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-md">
                    SEE weight: 50% scale
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                  <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600 block">Simulated Final Mark (out of 100):</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className="w-40 sm:w-56 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        value={activePredSee}
                        onChange={(e) => updateIndividualMark(activeSub.code, 'seePredicted', e.target.value)}
                      />
                      <span className="font-extrabold text-slate-800 w-12 text-right">{activePredSee} / 100</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="bg-white p-3 rounded-lg border border-slate-150">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">SEE weight scaled (50%)</span>
                      <span className="font-mono text-sm font-extrabold text-slate-800">{(activePredSee / 2).toFixed(1)} / 50</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-150">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Aggregate Total (100%)</span>
                      <span className="font-mono text-sm font-extrabold text-slate-800">{activeAggregate.toFixed(1)} / 100</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-150">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Projected Grade</span>
                      <span className={activeGradeObj.color}>{activeGradeObj.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEE Marks requirements matrices Table */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Target Score Milestones Table
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="py-2">Target Grade</th>
                        <th className="py-2">Minimum total marks</th>
                        <th className="py-2 text-right">SEE Marks required (on 100 scale)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                      <tr>
                        <td className="py-2 text-emerald-600 font-black">Grade S (Outstanding)</td>
                        <td className="py-2 font-mono">90 Marks</td>
                        <td className="py-2 text-right font-mono font-bold">
                          {getRequiredSeeMarks(activeSub.cieTotal, 90) === -1 ? (
                            <span className="text-red-500 font-normal italic">Mathematically impossible</span>
                          ) : (
                            <span>{getRequiredSeeMarks(activeSub.cieTotal, 90)} / 100</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-blue-600 font-bold">Grade A (Excellent)</td>
                        <td className="py-2 font-mono">80 Marks</td>
                        <td className="py-2 text-right font-mono font-bold">
                          {getRequiredSeeMarks(activeSub.cieTotal, 80) === -1 ? (
                            <span className="text-red-500 font-normal italic">Impossible</span>
                          ) : (
                            <span>{getRequiredSeeMarks(activeSub.cieTotal, 80)} / 100</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-indigo-605">Grade B (Very Good)</td>
                        <td className="py-2 font-mono">70 Marks</td>
                        <td className="py-2 text-right font-mono font-bold">
                          {getRequiredSeeMarks(activeSub.cieTotal, 70) === -1 ? (
                            <span>35 / 100 (Pass threshold)</span>
                          ) : (
                            <span>{getRequiredSeeMarks(activeSub.cieTotal, 70)} / 100</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-slate-600">Grade C (Good)</td>
                        <td className="py-2 font-mono">60 Marks</td>
                        <td className="py-2 text-right font-mono font-bold">
                          {getRequiredSeeMarks(activeSub.cieTotal, 60) === -1 ? (
                            <span>35 / 100</span>
                          ) : (
                            <span>{getRequiredSeeMarks(activeSub.cieTotal, 60)} / 100</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-red-650 font-bold">Minimum pass threshold (Joint)</td>
                        <td className="py-2 font-mono">40 Marks</td>
                        <td className="py-2 text-right font-mono text-red-650 font-bold">
                          {/* minimum is 35 because of 35% final exam pass criteria */}
                          <span>35 / 100</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  * Note: In VTU regulations, regardless of an exceptional CIE, a student MUST secure at least 35% in the final Semester End Exam (SEE) written paper to complete and pass the course.
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
              Please select a subject to simulate marks
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
