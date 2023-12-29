import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { SearchResult } from '../components/types';
import useDebounce from 'utils/hooks/useDebounce';
import { useState } from 'react';
import {
  resultsError,
  resultsLoad,
  resultsLoaded,
  SearchResultItem,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type UseSearchReturn = {
  error: unknown;
  isLoading: boolean;
  queryString: string;
  results: SearchResultItem[];
  setQuery: (q: string) => void;
};

export default function useSearch(orgId: number): UseSearchReturn {
  const apiClient = useApiClient();
  const [isTyping, setIsTyping] = useState(false);
  const [queryString, setQueryString] = useState('');
  const dispatch = useAppDispatch();
  const list = useAppSelector(
    (state) => state.search.matchesByQuery[queryString]
  );

  const debouncedFinishedTyping = useDebounce(async () => {
    setIsTyping(false);
  }, 600);

  const setQuery = (q: string) => {
    setQueryString(q);
    setIsTyping(true);
    debouncedFinishedTyping();
  };

  if (!isTyping && queryString.length > 2) {
    const future = loadListIfNecessary(list, dispatch, {
      actionOnError: (err) => resultsError([queryString, err]),
      actionOnLoad: () => resultsLoad(queryString),
      actionOnSuccess: (results) => resultsLoaded([queryString, results]),
      loader: () =>
        apiClient
          .post<SearchResult[], { q: string }>(`/api/search?orgId=${orgId}`, {
            q: queryString,
          })
          .then((results) =>
            results.map((result) => ({
              id: `${result.type}-${result.match.id}`,
              result,
            }))
          ),
    });

    return {
      error: future.error,
      isLoading: future.isLoading,
      queryString,
      results: future.data || [],
      setQuery,
    };
  } else {
    return {
      error: null,
      isLoading: false,
      queryString,
      results: [],
      setQuery,
    };
  }
}
