"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { RiDoubleQuotesL } from "react-icons/ri";
import { cn } from "@/src/lib/cn";
import type { QuoteItemProps } from "../types/quote.types";

const cardInitial = {
  opacity: 0,
  scale: 0.9,
  y: 20,
};

const cardAnimate = {
  opacity: 1,
  scale: 1,
  y: 0,
};

const cardTransition = {
  duration: 0.4,
  ease: "easeOut",
} as const;

const cardClassName = cn(
  "pointer-events-auto relative w-full max-w-[90vw] cursor-grab p-8 active:cursor-grabbing group"
);

const quoteIconClassName = cn(
  "mb-4 text-[#1DB954]/20 transition-colors group-hover:text-[#1DB954]/40"
);

const quoteTextClassName = cn(
  "text-2xl font-light leading-relaxed tracking-tight italic text-white/90 drop-shadow-2xl md:text-lg"
);

const authorLabelClassName = cn(
  "text-xs font-medium uppercase tracking-[0.3em] text-white/40"
);

export default function QuoteItem({
  quote,
  constraintsRef,
}: QuoteItemProps): ReactElement {
  const quoteText = `"${quote.text}"`;
  const dividerClassName = cn("h-px w-8 bg-[#1DB954]/60");
  const glowClassName = cn(
    "pointer-events-none absolute inset-0 rounded-full bg-[#1DB954]/5 blur-[80px]"
  );

  return (
    <motion.div
      drag
      dragElastic={0.1}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      initial={cardInitial}
      animate={cardAnimate}
      transition={cardTransition}
      className={cardClassName}
    >
      <div className={glowClassName} />

      <div >
        <div className={quoteIconClassName}>
          <RiDoubleQuotesL size={50} />
        </div>

        <div className="text-white">
          <p className={quoteTextClassName}>{quoteText}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className={dividerClassName} />
            <span className={authorLabelClassName}>{quote.author}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
