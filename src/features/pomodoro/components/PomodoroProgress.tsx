import type { PomodoroConfig } from "../types/pomodoro.types";

export default function PomodoroProgress({
  currentConfig,
  timeLeft,
}: {
  currentConfig: PomodoroConfig;
  timeLeft: number;
}) {
  return (
    <div className="mt-4 px-2">
      <progress
        value={currentConfig.minutes * 60 - timeLeft}
        max={currentConfig.minutes * 60}
        className="w-full h-1"
      />
    </div>
  );
}