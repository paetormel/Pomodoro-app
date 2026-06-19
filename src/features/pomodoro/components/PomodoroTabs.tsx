import type { PomodoroTab, TabId } from "../types/pomodoro.types";

type PomodoroTabsProps = {
  tabs: PomodoroTab[];
  currentTab: string;
  onChange: (id: TabId) => void;
};

export default function PomodoroTabs({
  tabs,
  currentTab,
  onChange,
}: PomodoroTabsProps) {
  return (
    <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all ${
            tab.id === currentTab
              ? "bg-white/10 text-white"
              : "text-white/40 hover:bg-white/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}