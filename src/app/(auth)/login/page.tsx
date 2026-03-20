"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { RiTimerFill } from "react-icons/ri";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">
      
      {/* Background Glows specific for Login Page */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-[#1DB954]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-purple-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 bg-[#121212]/80 backdrop-blur-2xl shadow-2xl text-center"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
            <RiTimerFill size={40} className="text-[#1DB954]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            Yani<span className="text-[#1DB954]">doro</span>
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
            Deep Work Dashboard
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-white/60 text-sm">
            Ready to get things done? Sign in to sync your tasks and timer history.
          </p>

          {/* Google Login Button */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-black font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
          >
            <FcGoogle size={24} />
            <span className="text-black">Continue with Google</span>
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-white/20">
              <span className="bg-[#121212] px-2 italic font-bold">secure authentication</span>
            </div>
          </div>

          <p className="text-[10px] text-white/20 leading-relaxed px-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>
    </div>
  );
}