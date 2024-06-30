import { useEffect, useState } from 'react';

import { useApiClient } from 'core/hooks';
import useDebounce from 'utils/hooks/useDebounce';
import { ZetkinPerson } from 'utils/types/zetkin';

type UsePersonSearchReturn = {
  isLoading: boolean;
  results: ZetkinPerson[];
  setQuery: (q: string) => void;
};

// TODO: Use search store instead, which will require refactoring by match type
export default function usePersonSearch(orgId: number): UsePersonSearchReturn {
  const apiClient = useApiClient();
  const [isTyping, setIsTyping] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [loadingByQueryString, setLoadingByQueryString] = useState<
    Record<string, boolean>
  >({});
  const [matchesByQueryString, setMatchesByQueryString] = useState<
    Record<string, ZetkinPerson[]>
  >({});

  const debouncedFinishedTyping = useDebounce(async () => {
    setIsTyping(false);
  }, 600);

  const setQuery = (q: string) => {
    setQueryString(q);
    setIsTyping(true);
    debouncedFinishedTyping();
  };

  useEffect(() => {
    if (!isTyping && queryString.length > 2) {
      setLoadingByQueryString({
        ...loadingByQueryString,
        [queryString]: true,
      });

      apiClient
        .post<ZetkinPerson[], { q: string }>(
          `/api/orgs/${orgId}/search/person`,
          {
            q: queryString,
          }
        )
        .then((persons) => {
          setMatchesByQueryString((currentValue) => ({
            ...currentValue,
            [queryString]: persons,
          }));
          setLoadingByQueryString({
            ...loadingByQueryString,
            [queryString]: false,
          });
        });
    }
  }, [isTyping]);

  return {
    isLoading: !!loadingByQueryString[queryString],
    results: matchesByQueryString[queryString] || [],
    setQuery,
  };
}
