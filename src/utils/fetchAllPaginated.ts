export async function fetchAllPaginated<T>(
  fetchPage: (page: number) => Promise<T[]>,
  batchSize: number = 100
): Promise<T[]> {
  const result: T[] = [];

  async function loadNextBatch(page: number = 1) {
    try {
      const batch = await fetchPage(page);
      result.push(...batch);

      if (batch.length >= batchSize) {
        await loadNextBatch(page + 1);
      }
    } catch (e) {
      // Stop recursively trying to fetch pages in case of error
      return;
    }
  }

  await loadNextBatch();
  return result;
}
