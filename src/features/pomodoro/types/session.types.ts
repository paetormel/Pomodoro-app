export type SessionType = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";

export interface PomodoroSessionPayload {
  sessionType: SessionType;
  durationMinutes: number;
  label: string;
  isCompleted?: boolean;
  startedAt?: string;
}

export interface PomodoroSessionRecord {
  id: string;
  sessionType: SessionType;
  durationMinutes: number;
  label: string | null;
  isCompleted: boolean;
  startedAt: string;
}
