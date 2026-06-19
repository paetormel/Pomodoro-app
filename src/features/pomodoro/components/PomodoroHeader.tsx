import { RiTimerFill } from "react-icons/ri";

export default function PomodoroHeader({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-4 px-2">
      <div className="flex items-center gap-2 text-[#1DB954]">
        <RiTimerFill size={20} />
        <span className="text-[11px] font-bold text-white/90 uppercase tracking-[0.2em]">
          Pomodoro
        </span>
      </div>

      <div
        onClick={onClose}
        className="w-8 h-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
      />
    </div>
  );
}