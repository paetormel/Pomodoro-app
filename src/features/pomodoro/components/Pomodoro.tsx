"use client";

import { motion } from "framer-motion";
import { usePomodoroController } from "../hooks/usePomodoroController";
import PomodoroHeader from "./PomodoroHeader";
import PomodoroTabs from "./PomodoroTabs";
import PomodoroProgress from "./PomodoroProgress";
import type { PomodoroWidgetProps } from "../types/pomodoro.types";
import PomodoroSettings from "./PomodoroSettings";
import PomodoroTimer from "./PomodoroTImer";

export default function Pomodoro({
  currentForm,
  setCurrentForm,
  constraintsRef,
}: PomodoroWidgetProps) {
  const controller = usePomodoroController();

  const handleCloseWidget = () => {
    const newSet = new Set(currentForm);
    newSet.delete("dashboard");
    setCurrentForm(newSet);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        className="pointer-events-auto absolute p-4 rounded-4xl border border-white/20 bg-[#282828]/90 backdrop-blur-2xl shadow-2xl w-100 overflow-hidden"
        style={{ top: "2%", left: "34%" }}
      >
        <PomodoroHeader onClose={handleCloseWidget} />

        <PomodoroTabs
          tabs={controller.tabs}
          currentTab={controller.currentTab}
          onChange={controller.changeTab}
        />

        <PomodoroTimer
          timeLeft={controller.timeLeft}
          isActive={controller.isActive}
          onPlayPause={controller.toggleTimer}
          onReset={controller.resetTimer}
          onSettings={controller.toggleSettings}
          showSettings={controller.showSettings}
        />

        <PomodoroSettings
          show={controller.showSettings}
          formState={controller.formState}
          onClose={controller.closeSettings}
          onSave={controller.saveSettings}
          onChange={controller.updateFormField}
          isLoading={controller.isLoading}
          isSaving={controller.isSaving}
        />

        <PomodoroProgress
          currentConfig={controller.currentConfig}
          timeLeft={controller.timeLeft}
        />
      </motion.div>
    </div>
  );
}