import { RiCheckLine, RiCloseLine } from "react-icons/ri";
import { PomodoroDurationField, PomodoroSettingsProps } from "../types/settings.types";


export default function PomodoroSettings({
  show,
  formState,
  onClose,
  onSave,
  onChange,
  isLoading,
  isSaving,
}: PomodoroSettingsProps) {
  if (!show) return null;

  const fields: { key: PomodoroDurationField; label: string }[] = [
    { key: "focusDurationMinutes", label: "Focus" },
    { key: "shortBreakDurationMinutes", label: "Short" },
    { key: "longBreakDurationMinutes", label: "Long" },
  ];

  return (
    <div className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/10">
      <div className="flex justify-between mb-4">
        <span className="text-[10px] text-[#1DB954] uppercase">
          Set Duration
        </span>

        <div className="flex gap-2">
          <button onClick={onClose}>
            <RiCloseLine />
          </button>
          <button onClick={onSave}>
            <RiCheckLine />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="text-[8px] text-white/30">
              {label}
            </label>

            <input
              type="number"
              value={formState[key]}
              onChange={(e) =>
                onChange(key, Number(e.target.value))
              }
              className="bg-black/40 border border-white/10 rounded-lg text-white text-xs w-full"
            />
          </div>
        ))}
      </div>

      {(isLoading || isSaving) && (
        <p className="text-[10px] text-white/20 mt-2">
          Loading...
        </p>
      )}
    </div>
  );
}