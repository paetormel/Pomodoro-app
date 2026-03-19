"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { RiTimerFill, RiFullscreenFill, RiFullscreenExitFill } from "react-icons/ri";
import Pomodoro from "../../../features/pomodoro/component/pomodoro";
import TodoList from "@/src/features/todo-list/component/todolist";
import Sidebar from "./sidebar";
import MusicPlayer from "@/src/features/music/component/musicPlayer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [currentForm, setCurrentForm] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const constraintsRef = useRef(null);

  // --- MOUSE TRACKING (Background Glow) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 250);
      mouseY.set(e.clientY - 250);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // --- FULLSCREEN HANDLER ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 1. LOADING STATE
  if (status === "loading") {
    return (
      <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <RiTimerFill size={80} className="text-[#1DB954] drop-shadow-[0_0_15px_rgba(29,185,84,0.5)]" />
          </motion.div>

          <div className="w-40 h-0.5 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-[#1DB954] to-transparent"
            />
          </div>
          
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] animate-pulse">
            Authenticating
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={constraintsRef}
      className="relative flex min-h-screen bg-[#050505] overflow-hidden select-none"
    >
      {/* --- INTERACTIVE BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute w-125 h-125 bg-[#1DB954]/10 rounded-full blur-[120px] opacity-50"
        />

        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/4 w-150 h-150 bg-purple-600/5 rounded-full blur-[150px]"
        />

        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      </div>

      <Sidebar currentForm={currentForm} setCurrentForm={setCurrentForm} />

      <button
        onClick={toggleFullscreen}
        className="fixed bottom-6 left-6 z-100 p-3 rounded-2xl border border-white/10 bg-[#121212]/50 backdrop-blur-xl text-white/40 hover:text-[#1DB954] hover:bg-white/5 transition-all shadow-2xl group"
      >
        {isFullscreen ? <RiFullscreenExitFill size={22} /> : <RiFullscreenFill size={22} />}
      </button>

      <main className="relative flex-1 z-10 p-6">
        {children}
      </main>
        
      {/* --- FLOATING COMPONENTS (WIDGETS) --- */}
      <div className="z-50 pointer-events-none">
        <AnimatePresence>
          {currentForm.has("dashboard") && (
            <Pomodoro 
              key="pomodoro-widget"
              currentForm={currentForm} 
              setCurrentForm={setCurrentForm} 
              constraintsRef={constraintsRef} 
            />
          )}
          
          {currentForm.has("task") && (
            <TodoList 
              key="todo-widget" 
              constraintsRef={constraintsRef} 
            />
          )}

          {currentForm.has("music") && (
            <MusicPlayer 
              key="music-widget" 
              constraintsRef={constraintsRef}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}