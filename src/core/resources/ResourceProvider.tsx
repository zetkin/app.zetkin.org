'use client';

import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

import { StreamedResource } from './types';

type ResourceCache = {
  parent: ResourceCache | null;
  serverResources: Map<string, Promise<unknown>>;
  wrappedResources: Map<string, Promise<unknown>>;
};

const ResourceContext = createContext<ResourceCache | null>(null);

type Props = PropsWithChildren<{
  resources: StreamedResource[];
}>;

export const ResourceProvider: FC<Props> = ({ children, resources }) => {
  const parent = useContext(ResourceContext);
  const cacheRef = useRef<ResourceCache | null>(null);

  if (!cacheRef.current) {
    cacheRef.current = {
      parent,
      serverResources: new Map(),
      wrappedResources: new Map(),
    };
  }

  resources.forEach(({ key, resource }) => {
    if (!cacheRef.current?.serverResources.has(key)) {
      cacheRef.current?.serverResources.set(key, resource);
    }
  });

  return (
    <ResourceContext.Provider value={cacheRef.current}>
      {children}
    </ResourceContext.Provider>
  );
};

export function useResourceCache() {
  const cache = useContext(ResourceContext);

  if (!cache) {
    throw new Error('ResourceProvider is missing');
  }

  return cache;
}
