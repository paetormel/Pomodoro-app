"use client";

import type { ReactElement } from "react";
import { QUOTE_COPY } from "../constants/quote.constants";
import type { QuoteEmptyStateProps } from "../types/quote.types";

export default function QuoteEmptyState({
  message,
}: QuoteEmptyStateProps): ReactElement {
  return (
    <div className="pointer-events-auto w-full max-w-[90vw] rounded-4xl border border-white/10 bg-[#121212]/90 p-8 text-center shadow-2xl backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/30">
        {QUOTE_COPY.sectionLabel}
      </p>
      <p className="mt-4 text-sm text-white/70">{message}</p>
    </div>
  );
}
