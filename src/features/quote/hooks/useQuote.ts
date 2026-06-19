import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/constants/queryKeys";
import { QUOTE_CACHE_DURATION_MS, QUOTE_COPY } from "../constants/quote.constants";
import {
  fetchDailyQuoteFromApi,
  getFallbackQuote,
  getStoredDailyQuote,
  getTodayQuoteDateKey,
  storeDailyQuote,
} from "../services/quote.service";
import type { Quote, UseQuoteResult } from "../types/quote.types";

const DEFAULT_QUOTE: Quote = {
  text: QUOTE_COPY.loading,
  author: QUOTE_COPY.defaultAuthor,
};

export function useQuote(): UseQuoteResult {
  const { data, isLoading } = useQuery<Quote>({
    queryKey: QUERY_KEYS.quote,
    queryFn: async (): Promise<Quote> => {
      const todayKey = getTodayQuoteDateKey();
      const storedQuote = getStoredDailyQuote(todayKey);

      if (storedQuote) {
        return storedQuote;
      }

      try {
        const nextQuote = await fetchDailyQuoteFromApi();
        storeDailyQuote(nextQuote, todayKey);
        return nextQuote;
      } catch {
        const fallbackQuote = getFallbackQuote();
        storeDailyQuote(fallbackQuote, todayKey);
        return fallbackQuote;
      }
    },
    staleTime: QUOTE_CACHE_DURATION_MS,
  });

  return {
    quote: data ?? DEFAULT_QUOTE,
    isLoading,
  };
}
