import type { Quote } from "../types/quote.types";

export const QUOTE_COPY = {
  loading: "Loading inspiration...",
  sectionLabel: "Quote",
  defaultAuthor: "Yanidoro",
} as const;

export const QUOTE_STORAGE_KEYS = {
  quote: "daily_quote",
  date: "quote_date",
} as const;

export const QUOTE_CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

export const QUOTE_FALLBACKS: Quote[] = [
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "Don't stop until you're proud.",
    author: "Anonymous",
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.",
    author: "Lou Holtz",
  },
] as const;
