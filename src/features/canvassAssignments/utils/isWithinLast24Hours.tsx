export const isWithinLast24Hours = (timestamps: string[]): boolean => {
  if (timestamps.length === 0) {
    return false;
  }
  const now = Date.now();
  const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;
  const twentyFourHoursAgo = now - twentyFourHoursInMillis;

  return timestamps.some((timestamp) => {
    const parsedTimestamp = Date.parse(timestamp);

    if (isNaN(parsedTimestamp)) {
      return false;
    }

    return parsedTimestamp >= twentyFourHoursAgo && parsedTimestamp <= now;
  });
};
