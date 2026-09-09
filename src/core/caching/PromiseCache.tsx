import { createContext, FC, PropsWithChildren, useRef } from 'react';

export type PromiseCache = Map<string, Promise<unknown>>;

export const PromiseCacheContext = createContext<PromiseCache | null>(null);

export const PromiseCacheProvider: FC<PropsWithChildren> = ({ children }) => {
  const promiseCache = useRef<PromiseCache>(new Map());

  return (
    <PromiseCacheContext.Provider value={promiseCache.current}>
      {children}
    </PromiseCacheContext.Provider>
  );
};
