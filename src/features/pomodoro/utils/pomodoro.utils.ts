import { DEFAULT_POMODORO_DURATIONS, POMODORO_TAB_DEFINITIONS } from "../constants/pomodoro.constants";
import type {
  PomodoroDurations,
  TabConfig,
} from "../types/pomodoro.types";

export function formatTime(totalSeconds: number): string {
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function buildPomodoroTabs(
  durations: PomodoroDurations = DEFAULT_POMODORO_DURATIONS
): TabConfig[] {
  return POMODORO_TAB_DEFINITIONS.map((tab) => {
    const minutes =
      tab.id === "pomodoro"
        ? durations.focusDurationMinutes
        : tab.id === "short-break"
          ? durations.shortBreakDurationMinutes
          : durations.longBreakDurationMinutes;

    return {
      ...tab,
      minutes,
    };
  });
}
