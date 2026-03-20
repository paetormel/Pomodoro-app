"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiHistoryFill, RiDeleteBin6Line, RiFocus2Line, RiCodeLine } from "react-icons/ri";

// 1. Types para sa History
interface Session {
  id: string;
  type: "focus" | "break";
  duration: number; // in minutes
  timestamp: string;
  label: string;
}

interface SessionHistoryProps {
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

const SessionHistory = ({ constraintsRef }: SessionHistoryProps) => {
  // Mock Data (Sa totoong app, kukunin mo 'to sa LocalStorage o Database)
  const [sessions, setSessions] = useState<Session[]>([
    { id: "1", type: "focus", duration: 25, timestamp: "2026-03-18T14:30:00", label: "Deep Work" },
    { id: "2", type: "break", duration: 5, timestamp: "2026-03-18T15:00:00", label: "Short Rest" },
    { id: "3", type: "focus", duration: 25, timestamp: "2026-03-18T15:35:00", label: "UI Design" },
  ]);

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-80">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        className="pointer-events-auto absolute p-5 rounded-4xl border border-white/20 bg-[#282828]/90  backdrop-blur-2xl shadow-2xl w-95"
        style={{ top: "15%", left: "10%" }}
      >
        {/* Header - Media Style */}
        <div className="flex justify-between items-center mb-5 px-2">
          <div className="flex items-center gap-2 text-[#1DB954]">
            <RiHistoryFill size={24} />
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">Session History</span>
          </div>
          <div className="w-8 h-1 bg-white/10 rounded-full cursor-grab active:cursor-grabbing"></div>
        </div>

        {/* List Container - Playlist Style */}
        <div className="bg-[#181818] rounded-2xl p-2 border border-white/5 shadow-inner">
          <div className="space-y-1 max-h-87.5 overflow-y-auto pr-1 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 group transition-colors"
                >
                  {/* Icon Indicator */}
                  <div className={`p-2 rounded-lg ${session.type === 'focus' ? 'bg-[#1DB954]/10 text-[#1DB954]' : 'bg-purple-500/10 text-purple-400'}`}>
                    {session.type === 'focus' ? <RiFocus2Line size={18} /> : <RiCodeLine size={18} />}
                  </div>

                  {/* Session Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white/80 truncate">{session.label}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-white/40 font-medium tracking-wide">
                        {session.duration} MINS
                      </span>
                      <span className="text-white/10 text-[8px]">•</span>
                      {/* NATIVE TAG: <time> for machine-readable dates */}
                      <time className="text-[10px] text-white/20">
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                  </div>

                  {/* Delete Action */}
                  <button 
                    onClick={() => deleteSession(session.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all"
                  >
                    <RiDeleteBin6Line size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {sessions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[11px] text-white/10 uppercase font-bold tracking-widest italic">History is clear</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats - Using <meter> tag for modern look */}
        <div className="mt-5 px-2">
          <div className="flex justify-between text-[9px] text-white/30 uppercase font-bold mb-2 tracking-tighter">
            <span>Daily Progress</span>
            <span>{sessions.filter(s => s.type === 'focus').length * 25} / 120 MINS</span>
          </div>
          <progress 
            value={sessions.filter(s => s.type === 'focus').length * 25} 
            max="120" 
            className="w-full h-1 appearance-none [&::-webkit-progress-bar]:bg-white/5 [&::-webkit-progress-value]:bg-[#1DB954] rounded-full overflow-hidden"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SessionHistory;