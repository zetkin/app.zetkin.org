type UsePromiseCacheReturn = {
  cache: (promise: Promise<unknown>) => void;
};

// TODO: Store this in context?
const promises: Record<string, Promise<unknown>> = {};

export default function usePromiseCache(
  cacheKey: string
): UsePromiseCacheReturn {
  const oldPromise = promises[cacheKey];

  if (oldPromise) {
    throw oldPromise;
  }

  return {
    cache(promise) {
      promises[cacheKey] = promise;

      promise.then(() => {
        delete promises[cacheKey];
      });

      promise.catch(() => {
        delete promises[cacheKey];
      });
    },
  };
}
