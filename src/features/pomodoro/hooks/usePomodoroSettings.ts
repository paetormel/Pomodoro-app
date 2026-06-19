import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_POMODORO_DURATIONS, DEFAULT_SPOTIFY_PLAYLIST_ID } from "../constants/pomodoro.constants";
import { fetchSettings, saveSettings } from "../services/pomodoro.service";
import type {
  PomodoroSettingsForm,
  UsePomodoroSettingsResult,
  UsePomodoroSettingsOptions,
} from "../types/settings.types";

export function usePomodoroSettings(
  options: UsePomodoroSettingsOptions = {}
): UsePomodoroSettingsResult {
  const { onSettingsLoaded, onSettingsSaved } = options;
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<PomodoroSettingsForm>({
    ...DEFAULT_POMODORO_DURATIONS,
    spotifyPlaylistId: DEFAULT_SPOTIFY_PLAYLIST_ID,
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (!settings) {
      return;
    }

    const syncSettings = window.setTimeout(() => {
      setFormState(settings);
      onSettingsLoaded?.(settings);
    }, 0);

    return () => window.clearTimeout(syncSettings);
  }, [onSettingsLoaded, settings]);

  const mutation = useMutation({
    mutationFn: () => saveSettings(formState),
    onSuccess: async (savedSettings) => {
      onSettingsSaved?.(savedSettings);
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const updateFormField = useCallback(
    <K extends keyof PomodoroSettingsForm>(
      field: K,
      value: PomodoroSettingsForm[K]
    ) => {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const saveCurrentSettings = useCallback(async () => {
    await mutation.mutateAsync();
  }, [mutation]);

  return {
    formState,
    isLoading,
    isSaving: mutation.isPending,
    saveSettings: saveCurrentSettings,
    updateFormField,
  };
}
