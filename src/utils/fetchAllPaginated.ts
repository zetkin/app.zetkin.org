export async function fetchAllPaginated<T>(
  fetchPage: (page: number) => Promise<T[]>,
  batchSize: number = 100
): Promise<T[]> {
  const result: T[] = [];

  async function loadNextBatch(page: number = 1) {
    const batch = await fetchPage(page);
    result.push(...batch);

    if (batch.length >= batchSize) {
      await loadNextBatch(page + 1);
    }
  }

  await loadNextBatch();
  return result;
}
