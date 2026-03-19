"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaPause } from "react-icons/fa6";
import { RiResetLeftLine, RiSettings4Fill, RiTimerFill } from "react-icons/ri";

type TabId = "pomodoro" | "short-break" | "long-break";

interface TabConfig {
  id: TabId;
  label: string;
  minutes: number;
}

const TABS: TabConfig[] = [
  { id: "pomodoro", label: "Focus", minutes: 25 },
  { id: "short-break", label: "Short Break", minutes: 5 },
  { id: "long-break", label: "Long Break", minutes: 15 },
];

interface PomodoroProps {
  currentForm: Set<string>;
  setCurrentForm: (value: Set<string>) => void;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

const Pomodoro: React.FC<PomodoroProps> = ({
  currentForm,
  setCurrentForm,
  constraintsRef,
}) => {
  const [currentTab, setCurrentTab] = useState<TabId>("pomodoro");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentConfig = TABS.find((t) => t.id === currentTab);
  const totalSeconds = currentConfig ? currentConfig.minutes * 60 : 25 * 60;

  useEffect(() => {
    audioRef.current = new Audio("/audio.mp3");
    audioRef.current.load();
  }, []);

 useEffect(() => {
  let interval: NodeJS.Timeout  | null = null;
  if(isActive){
    interval = setInterval(()=>{
      setTimeLeft((prev) => {
        if(prev <= 1){
          setIsActive(false);
          audioRef.current?.play().catch(() => {})
          return 0
        }
        return prev - 1
      })
    }, 1000);
  }

  return () => {if(interval) clearTimeout(interval)}
 }, [isActive]);

  const toggleTimer = () => setIsActive((prev) => !prev);

  const changeTab = (tab: TabConfig) => {
    setCurrentTab(tab.id);
    setIsActive(false);
    setTimeLeft(tab.minutes * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        // Inayos ang width dito (w-[400px])
        className="pointer-events-auto absolute p-4 rounded-4xl border border-white/20 bg-[#282828]/90  backdrop-blur-2xl shadow-2xl w-100"
        style={{ top: "5%", left: "35%" }}
      >
        <div className="flex justify-between items-center mb-4 px-2 active:cursor-grabbing">
          <div className="flex items-center gap-2 text-[#1DB954]">
            <RiTimerFill size={20} />
            <abbr
              title="Focus Timer"
              className="no-underline decoration-transparent"
            >
              <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">
                Pomodoro
              </span>
            </abbr>
          </div>
          <button
            onClick={() => {
              const newSet = new Set(currentForm);
              newSet.delete("dashboard");
              setCurrentForm(newSet);
            }}
            className="text-white/40 hover:text-white transition-colors"
          >
            <div className="w-8 h-1 bg-white/10 rounded-full cursor-grab "></div>
          </button>
        </div>

        <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all ${
                tab.id === currentTab
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:bg-white/5"
              }`}
              onClick={() => changeTab(tab)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#181818] rounded-2xl p-6 border border-white/5 flex flex-col items-center shadow-inner relative overflow-hidden">
        

          <div className="text-[72px] font-black text-white leading-none tracking-tighter mb-6 font-mono">
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                setIsActive(false);
                setTimeLeft(totalSeconds);
              }}
              className="text-white/60 hover:text-white transition-colors"
            >
              <RiResetLeftLine size={24} />
            </button>

            <button
              onClick={toggleTimer}
              className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
            >
              {isActive ? (
                <FaPause size={20} />
              ) : (
                <FaPlay size={20} className="ml-1" />
              )}
            </button>

            <details className="relative">
              <summary className="list-none text-white/60 hover:text-white cursor-pointer transition-colors">
                <RiSettings4Fill size={24} />
              </summary>
              <div className="absolute bottom-full right-0 mb-4 w-48 p-3 bg-[#282828] border border-white/10 rounded-xl text-[10px] text-white/60 z-50 shadow-2xl">
                <p className="mb-2 uppercase font-bold text-[#1DB954]">
                  Shortcuts
                </p>
                <p>
                  Press{" "}
                  <kbd className="bg-white/10 px-1 rounded border border-white/20 font-sans">
                    Space
                  </kbd>{" "}
                  to toggle.
                </p>
              </div>
            </details>
          </div>
        </div>

        <div className="mt-4 px-2">
            <progress
            value={totalSeconds - timeLeft}
            max={totalSeconds}
            className="border border-[#1DB954]/50  w-full h-1 appearance-none [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-[#1DB954] transition-all duration-1000"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Pomodoro;
