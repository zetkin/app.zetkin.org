type UsePromiseCacheReturn = {
  cache: (promise: Promise<unknown>) => void;
  oldPromise: Promise<unknown>;
};

// TODO: Store this in context?
const promises: Record<string, Promise<unknown>> = {};

export default function usePromiseCache(
  cacheKey: string
): UsePromiseCacheReturn {
  const oldPromise = promises[cacheKey];

  return {
    cache(promise) {
      if (oldPromise) {
        throw oldPromise;
      }

      promises[cacheKey] = promise;

      promise.then(() => {
        delete promises[cacheKey];
      });

      promise.catch(() => {
        delete promises[cacheKey];
      });
    },
    oldPromise,
  };
}
