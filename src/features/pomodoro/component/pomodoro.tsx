"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause } from "react-icons/fa6";
import { RiResetLeftLine, RiSettings4Fill, RiTimerFill, RiCloseLine, RiCheckLine } from "react-icons/ri";

type TabId = "pomodoro" | "short-break" | "long-break";

interface TabConfig {
  id: TabId;
  label: string;
  minutes: number;
}

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
  // 1. States for Configuration
  const [tabs, setTabs] = useState<TabConfig[]>([
    { id: "pomodoro", label: "Focus", minutes: 25 },
    { id: "short-break", label: "Short Break", minutes: 5 },
    { id: "long-break", label: "Long Break", minutes: 15 },
  ]);

  const [currentTab, setCurrentTab] = useState<TabId>("pomodoro");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [showSettings, setShowSettings] = useState(false);
  
  // Temp states para sa input fields
  const [tempMinutes, setTempMinutes] = useState<{ [key in TabId]: number }>({
    pomodoro: 25,
    "short-break": 5,
    "long-break": 15,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentConfig = tabs.find((t) => t.id === currentTab);
  const totalSeconds = currentConfig ? currentConfig.minutes * 60 : 25 * 60;

  useEffect(() => {
    audioRef.current = new Audio("/audio.mp3");
    audioRef.current.load();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            audioRef.current?.play().catch(() => {});
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive]);

  const toggleTimer = () => setIsActive((prev) => !prev);

  const changeTab = (tabId: TabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    setCurrentTab(tabId);
    setIsActive(false);
    setTimeLeft(tab.minutes * 60);
  };

  // 2. Settings Handler
  const saveSettings = () => {
    const updatedTabs = tabs.map(tab => ({
      ...tab,
      minutes: tempMinutes[tab.id]
    }));
    setTabs(updatedTabs);
    
    // Update current timer if it matches the edited tab
    const activeEditedTab = updatedTabs.find(t => t.id === currentTab);
    if (activeEditedTab) {
      setTimeLeft(activeEditedTab.minutes * 60);
    }
    
    setIsActive(false);
    setShowSettings(false);
  };

  const formatTime = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        className="pointer-events-auto absolute p-4 rounded-4xl border border-white/20 bg-[#282828]/90 backdrop-blur-2xl shadow-2xl w-100 overflow-hidden"
        style={{ top: "2%", left: "34%" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2 text-[#1DB954]">
            <RiTimerFill size={20} />
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">Pomodoro</span>
          </div>
          <div 
            onClick={() => {
              const newSet = new Set(currentForm);
              newSet.delete("dashboard");
              setCurrentForm(newSet);
            }}
            className="w-8 h-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
          ></div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all ${
                tab.id === currentTab ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5"
              }`}
              onClick={() => changeTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Timer Display */}
        <div className="bg-[#181818] rounded-2xl p-6 border border-white/5 flex flex-col items-center shadow-inner relative">
          <div className="text-[72px] font-black text-white leading-none tracking-tighter mb-6 font-mono">
            {formatTime(timeLeft)}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => { setIsActive(false); setTimeLeft(totalSeconds); }}
              className="text-white/60 hover:text-white transition-colors"
            >
              <RiResetLeftLine size={24} />
            </button>

            <button
              onClick={toggleTimer}
              className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
            >
              {isActive ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
            </button>

            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`transition-colors ${showSettings ? 'text-[#1DB954]' : 'text-white/60 hover:text-white'}`}
            >
              <RiSettings4Fill size={24} />
            </button>
          </div>
        </div>

        {/* --- SETTINGS PANEL --- */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-[#1DB954] uppercase tracking-widest">Set Duration (Min)</span>
                <div className="flex gap-2">
                   <button onClick={() => setShowSettings(false)} className="p-1 text-white/40 hover:text-white"><RiCloseLine size={18}/></button>
                   <button onClick={saveSettings} className="p-1 text-[#1DB954] hover:scale-110"><RiCheckLine size={18}/></button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {tabs.map(tab => (
                  <div key={tab.id} className="flex flex-col gap-1">
                    <label className="text-[8px] text-white/30 uppercase">{tab.label}</label>
                    <input 
                      type="number"
                      value={tempMinutes[tab.id]}
                      onChange={(e) => setTempMinutes({...tempMinutes, [tab.id]: parseInt(e.target.value) || 0})}
                      className="bg-black/40 border border-white/10 rounded-lg py-1 px-2 text-white text-xs outline-none focus:border-[#1DB954]/50 w-full"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-4 px-2">
          <progress
            value={totalSeconds - timeLeft}
            max={totalSeconds}
            className="border border-[#1DB954]/50 w-full h-1 appearance-none [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-[#1DB954] transition-all duration-1000"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Pomodoro;