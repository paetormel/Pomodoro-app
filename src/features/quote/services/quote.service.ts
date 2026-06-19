import { ENDPOINTS } from "@/src/constants/endpoints";
import { QUOTE_FALLBACKS, QUOTE_STORAGE_KEYS } from "../constants/quote.constants";
import type { Quote, QuoteProxyResponse, ZenQuote } from "../types/quote.types";

function getRandomFallbackIndex(): number {
  return Math.floor(Math.random() * QUOTE_FALLBACKS.length);
}

function parseZenQuoteResponse(contents: string): Quote {
  const parsedContents: unknown = JSON.parse(contents);

  if (!Array.isArray(parsedContents) || parsedContents.length === 0) {
    throw new Error("Invalid quote payload");
  }

  const firstQuote: unknown = parsedContents[0];

  if (typeof firstQuote !== "object" || firstQuote === null) {
    throw new Error("Invalid quote payload");
  }

  const candidate = firstQuote as Partial<ZenQuote>;

  if (typeof candidate.q !== "string" || typeof candidate.a !== "string") {
    throw new Error("Invalid quote payload");
  }

  return {
    text: candidate.q,
    author: candidate.a,
  };
}

export function getTodayQuoteDateKey(): string {
  return new Date().toDateString();
}

export function getStoredDailyQuote(dateKey: string): Quote | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedQuote = window.localStorage.getItem(QUOTE_STORAGE_KEYS.quote);
  const storedDate = window.localStorage.getItem(QUOTE_STORAGE_KEYS.date);

  if (!storedQuote || storedDate !== dateKey) {
    return null;
  }

  try {
    const parsedQuote: unknown = JSON.parse(storedQuote);

    if (
      typeof parsedQuote !== "object" ||
      parsedQuote === null ||
      !("text" in parsedQuote) ||
      !("author" in parsedQuote)
    ) {
      return null;
    }

    const quoteCandidate = parsedQuote as Partial<Quote>;

    if (
      typeof quoteCandidate.text !== "string" ||
      typeof quoteCandidate.author !== "string"
    ) {
      return null;
    }

    return {
      text: quoteCandidate.text,
      author: quoteCandidate.author,
    };
  } catch {
    return null;
  }
}

export function storeDailyQuote(quote: Quote, dateKey: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(QUOTE_STORAGE_KEYS.quote, JSON.stringify(quote));
    window.localStorage.setItem(QUOTE_STORAGE_KEYS.date, dateKey);
  } catch {
    // Ignore storage failures and continue rendering the quote.
  }
}

export function getFallbackQuote(): Quote {
  return QUOTE_FALLBACKS[getRandomFallbackIndex()];
}

export async function fetchDailyQuoteFromApi(): Promise<Quote> {
  const response = await fetch(
    ENDPOINTS.quoteProxy + encodeURIComponent(ENDPOINTS.zenQuotesRandom),
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Quote request failed (${response.status})`);
  }

  const proxyResponse = (await response.json()) as QuoteProxyResponse;

  if (typeof proxyResponse.contents !== "string") {
    throw new Error("Invalid quote proxy payload");
  }

  return parseZenQuoteResponse(proxyResponse.contents);
}
