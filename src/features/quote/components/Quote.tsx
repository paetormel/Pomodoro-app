"use client";

import type { ReactElement } from "react";
import { QUOTE_COPY } from "../constants/quote.constants";
import { useQuote } from "../hooks/useQuote";
import type { QuoteProps } from "../types/quote.types";
import QuoteItem from "./QuoteItem";
import QuoteEmptyState from "./QuoteEmptyState";
import { cn } from "@/src/lib/cn";

const dialogClassName = cn(
  "fixed bottom-20 right-12 z-50 overflow-visible border-none bg-transparent p-0 pointer-events-none"
);

export default function Quote({
  constraintsRef,
}: QuoteProps): ReactElement {
  const { quote, isLoading } = useQuote();
  const quoteContent = isLoading ? (
    <QuoteEmptyState message={QUOTE_COPY.loading} />
  ) : (
    <QuoteItem quote={quote} constraintsRef={constraintsRef} />
  );

  return (
    <dialog open className={dialogClassName}>
      {quoteContent}
    </dialog>
  );
}
