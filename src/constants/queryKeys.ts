export const QUERY_KEYS = {
  quote: ["quote"] as const,
  quoteByDate: (dateKey: string) => [...QUERY_KEYS.quote, dateKey] as const,
} as const;
