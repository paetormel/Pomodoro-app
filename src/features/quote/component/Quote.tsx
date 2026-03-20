"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; 
import { RiDoubleQuotesL } from "react-icons/ri";

interface QuoteProps {
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

// BACKUP QUOTES (Sakaling down ang API, ito ang gagamitin)
const studyFallbacks = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't stop until you're proud.", author: "Anonymous" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" }
];

const Quote = ({ constraintsRef }: QuoteProps) => {
  const [quote, setQuote] = useState({
    text: "Loading inspiration...",
    author: "Yanidoro",
  });

  useEffect(() => {
    const getDailyQuote = async () => {
      const today = new Date().toDateString();
      const savedQuote = localStorage.getItem("daily_quote");
      const savedDate = localStorage.getItem("quote_date");

      // 1. Check kung updated pa ang saved quote
      if (savedQuote && savedDate === today) {
        setQuote(JSON.parse(savedQuote));
        return;
      }

      // 2. Kung kailangan ng bago, try fetch sa API
      try {
        // ZenQuotes API via Proxy para iwas CORS issues
        const response = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const resData = await response.json();
        const data = JSON.parse(resData.contents); // Dahil sa proxy, kailangan i-parse yung contents

        if (data && data[0]) {
          const newQuote = {
            text: data[0].q,
            author: data[0].a,
          };
          
          setQuote(newQuote);
          localStorage.setItem("daily_quote", JSON.stringify(newQuote));
          localStorage.setItem("quote_date", today);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Fetch failed, using fallback:", error);
        
        // 3. FALLBACK: Pumili sa listahan kung nag-fail ang API
        const randomFallback = studyFallbacks[Math.floor(Math.random() * studyFallbacks.length)];
        setQuote(randomFallback);
        
        // I-save pa rin natin para hindi sya palit nang palit bawat refresh sa loob ng araw na yun
        localStorage.setItem("daily_quote", JSON.stringify(randomFallback));
        localStorage.setItem("quote_date", today);
      }
    };

    getDailyQuote();
  }, []);

  return (
    <dialog 
      open 
      className="fixed bottom-20 right-12 z-50 bg-transparent border-none p-0 overflow-visible pointer-events-none"
    >
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={constraintsRef}
        className="pointer-events-auto relative p-8 w-112.5 max-w-[90vw] cursor-grab active:cursor-grabbing group"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-[#1DB954]/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-4 text-[#1DB954]/20 group-hover:text-[#1DB954]/40 transition-colors">
            <RiDoubleQuotesL size={50} />
          </div>

          <div className="text-white">
            <p className="text-2xl md:text-lg font-light leading-relaxed tracking-tight italic text-white/90 drop-shadow-2xl">
              {`"${quote.text}"`}
            </p>
            
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-8 bg-[#1DB954]/60" />
              <span className="text-xs font-medium text-white/40 uppercase tracking-[0.3em]">
                {quote.author}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </dialog>
  );
};

export default Quote;