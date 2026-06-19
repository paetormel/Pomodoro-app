export interface PomodoroSettings {
  focusDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  spotifyPlaylistId: string | null;
}

export type PomodoroSettingsForm = PomodoroSettings;

export type SavePomodoroSettingsPayload = PomodoroSettings;

export type PomodoroSettingsResponse = PomodoroSettings | null;

export interface UsePomodoroSettingsResult {
  formState: PomodoroSettingsForm;
  isLoading: boolean;
  isSaving: boolean;
  saveSettings: () => Promise<void>;
  updateFormField: <K extends keyof PomodoroSettingsForm>(
    field: K,
    value: PomodoroSettingsForm[K]
  ) => void;
}

export interface UsePomodoroSettingsOptions {
  onSettingsLoaded?: (settings: PomodoroSettings) => void;
  onSettingsSaved?: (settings: PomodoroSettings) => void;
}

export type PomodoroDurationField =
  | "focusDurationMinutes"
  | "shortBreakDurationMinutes"
  | "longBreakDurationMinutes";

type FormState = Record<PomodoroDurationField, number>;

export type PomodoroSettingsProps = {
  show: boolean;
  formState: FormState;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  onChange: (key: PomodoroDurationField, value: number) => void;
  isLoading: boolean;
  isSaving: boolean;
};
