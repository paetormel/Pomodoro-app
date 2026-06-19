import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_ALARM_AUDIO_SRC, DEFAULT_POMODORO_DURATIONS, SESSION_TYPE_MAP } from "../constants/pomodoro.constants";
import { buildPomodoroTabs } from "../utils/pomodoro.utils";
import { savePomodoroSession } from "../services/pomodoro.service";
import type { PomodoroDurations, TabId, UsePomodoroTimerResult } from "../types/pomodoro.types";
import type { PomodoroSettings } from "../types/settings.types";

export function usePomodoroTimer(
  initialDurations: PomodoroDurations = DEFAULT_POMODORO_DURATIONS
): UsePomodoroTimerResult {
  const [durations, setDurations] = useState<PomodoroDurations>(initialDurations);
  const [currentTab, setCurrentTab] = useState<TabId>("pomodoro");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialDurations.focusDurationMinutes * 60);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasSavedCompletionRef = useRef(false);
  const currentTabRef = useRef<TabId>("pomodoro");

  useEffect(() => {
    audioRef.current = new Audio(DEFAULT_ALARM_AUDIO_SRC);
    audioRef.current.load();
  }, []);

  const tabs = useMemo(() => buildPomodoroTabs(durations), [durations]);

  const currentConfig = useMemo(() => {
    return tabs.find((tab) => tab.id === currentTab) ?? tabs[0];
  }, [tabs, currentTab]);

  const syncSavedSettings = useCallback((settings: PomodoroSettings) => {
    const nextDurations: PomodoroDurations = {
      focusDurationMinutes: settings.focusDurationMinutes,
      shortBreakDurationMinutes: settings.shortBreakDurationMinutes,
      longBreakDurationMinutes: settings.longBreakDurationMinutes,
    };

    setDurations(nextDurations);
    setIsActive(false);
    hasSavedCompletionRef.current = false;

    const activeTabId = currentTabRef.current;
    const activeMinutes =
      activeTabId === "pomodoro"
        ? nextDurations.focusDurationMinutes
        : activeTabId === "short-break"
          ? nextDurations.shortBreakDurationMinutes
          : nextDurations.longBreakDurationMinutes;

    setTimeLeft(activeMinutes * 60);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (hasSavedCompletionRef.current) {
              return 0;
            }

            hasSavedCompletionRef.current = true;
            setIsActive(false);

            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              void audioRef.current.play().catch((error) => {
                console.error("Failed to play alarm sound:", error);
              });
            }

            void savePomodoroSession({
              sessionType: SESSION_TYPE_MAP[currentTab],
              durationMinutes: currentConfig.minutes,
              label: currentConfig.label,
              isCompleted: true,
            });

            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentConfig.label, currentConfig.minutes, currentTab, isActive]);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const changeTab = useCallback((tabId: TabId) => {
    currentTabRef.current = tabId;
    setCurrentTab(tabId);
    setIsActive(false);
    hasSavedCompletionRef.current = false;

    const nextConfig = tabs.find((tab) => tab.id === tabId);
    if (nextConfig) {
      setTimeLeft(nextConfig.minutes * 60);
    }
  }, [tabs]);

  const resetTimer = useCallback(() => {
    hasSavedCompletionRef.current = false;
    setIsActive(false);
    setTimeLeft(currentConfig.minutes * 60);
  }, [currentConfig.minutes]);

  const toggleSettings = useCallback(() => {
    setShowSettings((prev) => !prev);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  return {
    tabs,
    currentTab,
    currentConfig,
    timeLeft,
    isActive,
    showSettings,
    toggleTimer,
    changeTab,
    resetTimer,
    toggleSettings,
    closeSettings,
    syncSavedSettings,
  };
}
