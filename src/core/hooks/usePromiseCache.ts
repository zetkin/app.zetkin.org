type UsePromiseCacheReturn = {
  cache: (promise: Promise<unknown>) => void;
  getExistingPromise: () => Promise<unknown> | undefined;
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
    getExistingPromise() {
      return promises[cacheKey];
    },
  };
}
