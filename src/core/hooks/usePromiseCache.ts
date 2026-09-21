import { useContext } from 'react';

import { PromiseCacheContext } from 'core/caching/PromiseCache';

type UsePromiseCacheReturn = {
  cache: (promise: Promise<unknown>) => void;
  getExistingPromise: () => Promise<unknown> | undefined;
};

export default function usePromiseCache(
  cacheKey: string
): UsePromiseCacheReturn {
  const promiseCache = useContext(PromiseCacheContext);

  if (!promiseCache) {
    throw new Error(
      'usePromiseCache must be used within a PromiseCacheProvider'
    );
  }

  return {
    cache(promise) {
      promiseCache.set(cacheKey, promise);

      promise.finally(() => {
        if (promiseCache.get(cacheKey) === promise) {
          promiseCache.delete(cacheKey);
        }
      });
    },

    getExistingPromise() {
      return promiseCache.get(cacheKey);
    },
  };
}
