type UsePromiseCacheReturn = {
  cache: (promise: Promise<unknown>) => void;
  getOldPromise: () => Promise<unknown> | undefined | null;
};

// TODO: Store this in context?
const promises: Record<string, Promise<unknown>> = {};

export default function usePromiseCache(
  cacheKey: string
): UsePromiseCacheReturn {
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
    getOldPromise() {
      return promises[cacheKey];
    },
  };
}
