import type { TabId } from "../types/pomodoro.types";
import type { SessionType } from "../types/session.types";

export const DEFAULT_POMODORO_DURATIONS = {
  focusDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
};

export const DEFAULT_SPOTIFY_PLAYLIST_ID = "0vvXsWCC9xrXsKd4FyS8kM";
export const DEFAULT_ALARM_AUDIO_SRC = "/alarm.mp3";

export const POMODORO_TAB_DEFINITIONS: Array<{
  id: TabId;
  label: string;
}> = [
  { id: "pomodoro", label: "Focus" },
  { id: "short-break", label: "Short Break" },
  { id: "long-break", label: "Long Break" },
];

export const SESSION_TYPE_MAP: Record<TabId, SessionType> = {
  pomodoro: "FOCUS",
  "short-break": "SHORT_BREAK",
  "long-break": "LONG_BREAK",
};
