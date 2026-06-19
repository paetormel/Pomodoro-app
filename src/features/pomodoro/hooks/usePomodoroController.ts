import { useMemo } from "react";
import { usePomodoroSettings } from "./usePomodoroSettings";
import { usePomodoroTimer } from "./usePomodoroTimer";

export function usePomodoroController() {
  const timer = usePomodoroTimer();

  const settings = usePomodoroSettings({
    onSettingsLoaded: timer.syncSavedSettings,
    onSettingsSaved: timer.syncSavedSettings,
  });

  const controller = useMemo(
    () => ({
      ...timer,
      ...settings,
    }),
    [settings, timer]
  );

  return controller;
}
