"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Mood from "@/src/features/mood/component/Mood";
import Theme from "@/src/features/theme/component/Theme";
import { FaMusic } from "react-icons/fa6";
import {
  LuTimer,
  LuListTodo,
} from "react-icons/lu";
import { RiHistoryFill } from "react-icons/ri";
import { PiQuotesFill } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";

const sidebarData = [
  { id: "dashboard", label: "Timer", icon: LuTimer },
  { id: "task", label: "Task", icon: LuListTodo },
  { id: "session-history", label: "History", icon: RiHistoryFill },
  { id: "quote", label: "Quote", icon: PiQuotesFill },
  { id: "music", label: "Music", icon: FaMusic },
];

interface SidebarProps {
  currentForm: Set<string>;
  setCurrentForm: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const Sidebar = ({ currentForm, setCurrentForm }: SidebarProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSidebar = (id: string) => {
    const newSet = new Set(currentForm);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCurrentForm(newSet);
  };

  const handleProfileClick = () => {
    if (session) {
      setShowSignOutModal(true);
    } else {
      router.push("/login");
    }
  };

  const handleConfirmSignOut = async () => {
    setShowSignOutModal(false);
    await signOut();
  };

  return (
    // Ginawang fixed sa bottom, full width pero may max-width para magmukhang "Dock"
    <>
      <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto max-w-[95vw] h-18 bg-transparent z-100">
        <nav className="flex items-center h-full px-4 rounded-[2.5rem] border border-white/20 bg-[#282828]/90 backdrop-blur-xl text-white/40 shadow-2xl gap-2">
        
        {/* PROFILE SECTION (Nasa unahan na ngayon) */}
        <div className="pr-2 border-r border-white/10 flex justify-center items-center shrink-0">
          <button 
            onClick={handleProfileClick}
            className="group relative flex flex-col items-center justify-center h-16 w-16 rounded-2xl hover:bg-white/5 transition-all duration-300"
          >
            {session ? (
              <div className="relative w-9 h-9">
                <Image
                  src={session.user?.image || ""}
                  fill
                  className="rounded-full border-2 border-[#1DB954] object-cover p-0.5"
                  alt="profile"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#1DB954] rounded-full border-2 border-[#282828]" />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <CgProfile size={24} className="group-hover:text-white transition-colors" />
                <span className="text-[8px] mt-1 uppercase font-bold tracking-tighter">Login</span>
              </div>
            )}
          </button>
        </div>

          {/* ICONS SECTION (Nakahiga gamit ang flex-row) */}
          <div className="flex flex-row items-center gap-1 overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2">
            {sidebarData.map((data) => {
              const Icon = data.icon;
              const isActive = currentForm.has(data.id);

              return (
                <button
                  key={data.id}
                  type="button"
                  className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl h-16 w-16 text-sm font-medium transition-all duration-300 shrink-0
                  ${
                    isActive
                      ? "bg-white/10 text-[#1DB954]" 
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => handleSidebar(data.id)}
                >
                  <Icon className="text-xl" />
                  <span className="text-[9px] text-center leading-tight uppercase tracking-tighter">
                    {data.label}
                  </span>

                  {/* Popups Alignment (Ngayon ay nasa taas na ng dock) */}
                  {isActive && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-110">
                      {data.id === "theme" && <Theme />}
                      {data.id === "mood-tracker" && <Mood />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </nav>
      </aside>

      {showSignOutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#121212] p-6 shadow-2xl shadow-black/40">
            <h2 className="text-xl font-semibold text-white">Sign out?</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Are you sure you want to sign out? You’ll need to log in again to access your saved tasks and sessions.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSignOutModal(false)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOut}
                className="rounded-full bg-[#1DB954] px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
