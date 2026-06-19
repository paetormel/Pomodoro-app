import type { RefObject } from "react";

export interface Quote {
  text: string;
  author: string;
}

export interface QuoteProps {
  constraintsRef: RefObject<HTMLDivElement | null>;
}

export interface QuoteItemProps {
  quote: Quote;
  constraintsRef: RefObject<HTMLDivElement | null>;
}

export interface QuoteEmptyStateProps {
  message: string;
}

export interface QuoteProxyResponse {
  contents: string;
}

export interface ZenQuote {
  q: string;
  a: string;
}

export interface UseQuoteResult {
  quote: Quote;
  isLoading: boolean;
}
