import type { RefObject } from "react";
import type { PomodoroSettings } from "./settings.types";

export type TabId = "pomodoro" | "short-break" | "long-break";

export interface TabConfig {
  id: TabId;
  label: string;
  minutes: number;
}

export interface PomodoroDurations {
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
}

export interface PomodoroWidgetProps {
  currentForm: Set<string>;
  setCurrentForm: (value: Set<string>) => void;
  constraintsRef: RefObject<HTMLDivElement | null>;
}

export interface UsePomodoroTimerResult {
  tabs: TabConfig[];
  currentTab: TabId;
  currentConfig: TabConfig;
  timeLeft: number;
  isActive: boolean;
  showSettings: boolean;
  toggleTimer: () => void;
  changeTab: (tabId: TabId) => void;
  resetTimer: () => void;
  toggleSettings: () => void;
  closeSettings: () => void;
  syncSavedSettings: (settings: PomodoroSettings) => void;
}

export type PomodoroTab = {
  id: TabId;
  label: string;
};

export type PomodoroTimerProps = {
  timeLeft: number;
  isActive: boolean;
  showSettings: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSettings: () => void;
};

export type PomodoroConfig = {
  minutes: number;
};