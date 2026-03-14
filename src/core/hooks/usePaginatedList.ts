import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Api2Response } from 'core/api/types';
import useApiClient from 'core/hooks/useApiClient';
import FetchApiClient from 'core/api/client/FetchApiClient';

export type PaginatedListErrorState = {
  error: unknown;
  pageSize?: undefined;
  pages?: undefined;
  status: 'error';
  totalCount?: undefined;
};

export type PaginatedListLoadingState = {
  error?: undefined;
  pageSize?: undefined;
  pages?: undefined;
  status: 'loading';
  totalCount?: undefined;
};

export type PaginatedListLoadedState<T> = {
  error?: undefined;
  pageSize: number;
  pages: (T[] | null)[];
  status: 'loaded';
  totalCount: number;
};

export type PaginatedListState<T> =
  | PaginatedListLoadedState<T>
  | PaginatedListLoadingState
  | PaginatedListErrorState;

export type PaginatedListApi = {
  loadNextPage: (signal?: AbortSignal) => Promise<void>;
  loadPage: (page: number, signal?: AbortSignal) => Promise<void>;
};

export type PaginatedList<T> = PaginatedListApi & PaginatedListState<T>;

export default function usePaginatedList<T>(path: string): PaginatedList<T> {
  const apiClient = useApiClient();

  if (!(apiClient instanceof FetchApiClient)) {
    throw new Error('cannot use paginated list without fetch');
  }

  const loadingPages = useRef<Record<number, Promise<void> | undefined>>({});

  const [state, setState] = useState<PaginatedListState<T>>({
    status: 'loading',
  });

  const loadPage = useCallback(
    async (page: number, signal?: AbortSignal) => {
      const init: RequestInit | undefined = signal
        ? { signal: signal }
        : undefined;

      const pageSize = state.pageSize;

      const url = new URL(path, 'http://dummy');
      if (typeof page !== 'undefined') {
        url.searchParams.append('page', (page + 1).toString());
      }
      if (typeof pageSize !== 'undefined') {
        url.searchParams.append('pageSize', pageSize.toString());
      }
      const pagePath = url.pathname + url.search;

      const res = await apiClient.fetch(pagePath, init);
      const body = (await res.json()) as Api2Response<T[]>;

      const pageCount = Math.ceil(
        (body.meta.pagination.total + 1) / body.meta.pagination.size
      );
      setState((state) => {
        const pages: (T[] | null)[] = state.pages
          ? [...state.pages]
          : new Array(pageCount).fill(null);

        if (page < pages.length) {
          pages[page] = body.data;
        }

        return {
          isLoading: false,
          pageSize: body.meta.pagination.size,
          pages: pages,
          status: 'loaded',
          totalCount: body.meta.pagination.total,
        };
      });
    },
    [state.pageSize, apiClient]
  );

  const loadPageWrapper = useCallback(
    async (page: number, signal?: AbortSignal) => {
      try {
        const loadingPage = loadingPages.current[page];
        if (loadingPage) {
          await loadingPage;
          return;
        }

        const promise = loadPage(page, signal);
        loadingPages.current[page] = promise;
        await promise;
      } catch (err) {
        if (
          err &&
          typeof err === 'object' &&
          'name' in err &&
          err.name === 'AbortError'
        ) {
          return;
        }

        setState(() => ({
          error: err,
          isLoading: false,
          status: 'error',
        }));
      } finally {
        delete loadingPages.current[page];
      }
    },
    [loadPage]
  );

  useEffect(() => {
    if (
      state.status !== 'loading' ||
      Object.keys(loadingPages.current).length > 0
    ) {
      return;
    }

    const controller = new AbortController();

    loadPageWrapper(0, controller.signal);

    return () => controller.abort();
  }, [loadPageWrapper, state.status]);

  const loadNextPage = useCallback(
    (signal?: AbortSignal) => {
      if (!state.pages) {
        return Promise.resolve();
      }

      const nonLoadedPage = state.pages.findIndex((page) => !page);
      if (nonLoadedPage < 0) {
        return Promise.resolve();
      }

      return loadPageWrapper(nonLoadedPage, signal);
    },
    [loadPageWrapper, state.pages]
  );

  return useMemo(
    () => ({ ...state, loadNextPage, loadPage: loadPageWrapper }),
    [state, loadNextPage, loadPageWrapper]
  );
}
