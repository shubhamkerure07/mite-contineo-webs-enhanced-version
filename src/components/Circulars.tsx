import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Info, Megaphone, Calendar, Bookmark, Filter, ShieldAlert } from 'lucide-react';
import { AcademicCircular } from '../types';

interface CircularsProps {
  circulars: AcademicCircular[];
}

export default function Circulars({ circulars }: CircularsProps) {
  const [filter, setFilter] = useState<string>('All');
  const [selectedCirc, setSelectedCirc] = useState<AcademicCircular | null>(null);

  // Categories list
  const categories = ['All', 'Exam', 'Academic', 'Fees', 'Placement', 'General'];

  const filteredCirculars = circulars.filter(circ => {
    if (filter === 'All') return true;
    return circ.category === filter;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Megaphone className="h-5.5 w-5.5 text-blue-600" /> Department Circulars & Bulletin Board
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Official real-time notices released by the MITE Chief Academic Office, Department of CSE, and VTU registrar desks.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto p-1.5 bg-white border border-slate-100 rounded-2xl gap-1.5 shadow-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setSelectedCirc(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold leading-none shrink-0 transition-all cursor-pointer ${
              filter === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-50'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat} {cat === 'Exam' ? '✍️' : cat === 'Fees' ? '💳' : cat === 'Placement' ? '🎯' : ''}
          </button>
        ))}
      </div>

      {/* Split details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Notice lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Released Circular Notices ({filteredCirculars.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 space-y-4">
              {filteredCirculars.map((circ) => (
                <div 
                  key={circ.id}
                  onClick={() => setSelectedCirc(circ)}
                  className={`pt-4 first:pt-0 group cursor-pointer p-3 rounded-xl transition-all duration-150 ${
                    selectedCirc?.id === circ.id 
                      ? 'bg-blue-50/50 border border-blue-100/50' 
                      : 'hover:bg-slate-50/70 border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="text-slate-400 flex items-center gap-0.5"><Calendar className="w-3 h-3" /> {circ.date}</span>
                        <span className="text-slate-300">•</span>
                        <span className={`px-1.5 py-0.2 rounded-sm uppercase ${
                          circ.category === 'Exam' ? 'bg-orange-100 text-orange-850' :
                          circ.category === 'Fees' ? 'bg-rose-100 text-rose-850' : 
                          circ.category === 'Placement' ? 'bg-teal-100 text-teal-850' : 'bg-slate-100 text-slate-650'
                        }`}>
                          {circ.category}
                        </span>
                        {circ.isUrgent && (
                          <span className="bg-red-100 text-red-750 px-1.5 py-0.2 rounded-sm uppercase font-black tracking-wider animate-pulse flex items-center gap-0.5">
                            <ShieldAlert className="w-2.5 h-2.5" /> Urgent
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-blue-650">
                        {circ.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2">
                        {circ.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCirculars.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No bulletins match the filtered category.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected View Details Panel */}
        <div>
          {selectedCirc ? (
            <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-md shadow-blue-50/20 space-y-4 sticky top-6 animate-fadeIn">
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span className="text-slate-400 italic">Notice ID: {selectedCirc.id}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{selectedCirc.date}</span>
              </div>

              <h3 className="font-black text-slate-800 text-base sm:text-lg leading-snug">
                {selectedCirc.title}
              </h3>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed font-semibold">
                {selectedCirc.content}
              </div>

              <div className="pt-4 border-t border-slate-105 flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase">
                <span>Issued: Chief Registrar</span>
                <button
                  onClick={() => alert(`Saved copy for ${selectedCirc.title} to computer!`)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer transition-colors"
                >
                  Download PDF Notice
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 text-xs font-semibold space-y-2">
              <Megaphone className="h-8 w-8 text-slate-300 mx-auto" />
              <p>Select any circular announcement from the list to view full institutional text bulletins and save official prints.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
