import { FaPause, FaPlay } from "react-icons/fa6";
import { RiResetLeftLine, RiSettings4Fill } from "react-icons/ri";
import { formatTime } from "../utils/pomodoro.utils";
import type { PomodoroTimerProps } from "../types/pomodoro.types";

export default function PomodoroTimer({
  timeLeft,
  isActive,
  onPlayPause,
  onReset,
  onSettings,
  showSettings,
}: PomodoroTimerProps) {
  return (
    <div className="bg-[#181818] rounded-2xl p-6 border border-white/5 flex flex-col items-center shadow-inner">
      {/* TIMER DISPLAY */}
      <div className="text-[72px] font-black text-white font-mono mb-6">
        {formatTime(timeLeft)}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-8">
        <button
          onClick={onReset}
          aria-label="Reset timer"
          className="text-white/70 hover:text-white transition"
        >
          <RiResetLeftLine size={24} />
        </button>

        <button
          onClick={onPlayPause}
          aria-label={isActive ? "Pause timer" : "Start timer"}
          className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition"
        >
          {isActive ? <FaPause size={18} /> : <FaPlay size={18} />}
        </button>

        <button
          onClick={onSettings}
          aria-label="Open settings"
          className={`transition ${
            showSettings ? "text-[#1DB954]" : "text-white/70 hover:text-white"
          }`}
        >
          <RiSettings4Fill size={24} />
        </button>
      </div>
    </div>
  );
}