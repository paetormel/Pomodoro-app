"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  RiHistoryFill,
  RiDeleteBin6Line,
  RiFocus2Line,
  RiCodeLine,
} from "react-icons/ri";

interface Session {
  id: string;
  sessionType: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
  durationMinutes: number;
  startedAt: string;
  label: string | null;
  isCompleted: boolean;
}

interface SessionHistoryProps {
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

const SessionHistory = ({ constraintsRef }: SessionHistoryProps) => {
  const queryClient = useQueryClient();

  const {
    data: sessions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await fetch("/api/pomodoro-sessions");

      if (response.status === 401) {
        return [] as Session[];
      }

      if (!response.ok) {
        throw new Error("Failed to load sessions");
      }

      return (await response.json()) as Session[];
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/pomodoro-sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  const deleteSession = async (id: string) => {
    try {
      await deleteSessionMutation.mutateAsync(id);
    } catch (deleteError) {
      console.error(deleteError);
    }
  };

  const focusMinutes = sessions
    .filter((session) => session.sessionType === "FOCUS" && session.isCompleted)
    .reduce((sum, session) => sum + session.durationMinutes, 0);

  const getToneClass = (sessionType: Session["sessionType"]) => {
    return sessionType === "FOCUS"
      ? "bg-[#1DB954]/10 text-[#1DB954]"
      : "bg-purple-500/10 text-purple-400";
  };

  const getIcon = (sessionType: Session["sessionType"]) => {
    return sessionType === "FOCUS" ? (
      <RiFocus2Line size={18} />
    ) : (
      <RiCodeLine size={18} />
    );
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
        <div className="flex justify-between items-center mb-5 px-2">
          <div className="flex items-center gap-2 text-[#1DB954]">
            <RiHistoryFill size={24} />
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">
              Session History
            </span>
          </div>
          <div className="w-8 h-1 bg-white/10 rounded-full cursor-grab active:cursor-grabbing"></div>
        </div>

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
                  <div className={`p-2 rounded-lg ${getToneClass(session.sessionType)}`}>
                    {getIcon(session.sessionType)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white/80 truncate">
                      {session.label ?? "Untitled Session"}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-white/40 font-medium tracking-wide">
                        {session.durationMinutes} MINS
                      </span>
                      <span className="text-white/10 text-[8px]">•</span>
                      <time className="text-[10px] text-white/20">
                        {new Date(session.startedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSession(session.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all"
                  >
                    <RiDeleteBin6Line size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-[11px] text-white/20 uppercase font-bold tracking-widest italic">
                  Loading session history...
                </p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[11px] text-white/10 uppercase font-bold tracking-widest italic">
                  {error instanceof Error ? "Could not load history." : "History is clear"}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 px-2">
          <div className="flex justify-between text-[9px] text-white/30 uppercase font-bold mb-2 tracking-tighter">
            <span>Daily Progress</span>
            <span>{focusMinutes} / 120 MINS</span>
          </div>
          <progress
            value={focusMinutes}
            max="120"
            className="w-full h-1 appearance-none [&::-webkit-progress-bar]:bg-white/5 [&::-webkit-progress-value]:bg-[#1DB954] rounded-full overflow-hidden"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SessionHistory;
