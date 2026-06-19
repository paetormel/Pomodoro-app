import type {
  PomodoroSettings,
  PomodoroSettingsResponse,
  SavePomodoroSettingsPayload,
} from "../types/settings.types";
import type {
  PomodoroSessionPayload,
  PomodoroSessionRecord,
} from "../types/session.types";

export async function fetchSettings(): Promise<PomodoroSettingsResponse> {
  const response = await fetch("/api/settings");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load settings");
  }

  return (await response.json()) as PomodoroSettings;
}

export async function saveSettings(
  payload: SavePomodoroSettingsPayload
): Promise<PomodoroSettings> {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save settings");
  }

  return (await response.json()) as PomodoroSettings;
}

export async function savePomodoroSession(
  payload: PomodoroSessionPayload
): Promise<PomodoroSessionRecord> {
  const response = await fetch("/api/pomodoro-sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save session");
  }

  return (await response.json()) as PomodoroSessionRecord;
}
