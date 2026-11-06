import { useEffect, useState } from 'react';

import useApiClient from 'core/hooks/useApiClient';
import searchUsers from '../rpc/searchUsers';
import { ZetkinUser } from 'utils/types/zetkin';

export default function useUserSearch(query: string) {
  const apiClient = useApiClient();
  const [state, setState] = useState<{
    error: unknown;
    isLoading: boolean;
    query: string;
    users: ZetkinUser[];
  }>({ error: null, isLoading: !!query.trim(), query, users: [] });

  useEffect(() => {
    if (!query.trim()) {
      setState({ error: null, isLoading: false, query, users: [] });
      return;
    }

    let cancelled = false;
    setState({ error: null, isLoading: true, query, users: [] });

    const timeout = setTimeout(() => {
      apiClient.rpc(searchUsers, { query }).then(
        (users) => {
          if (!cancelled) {
            setState({ error: null, isLoading: false, query, users });
          }
        },
        (error: unknown) => {
          if (!cancelled) {
            setState({ error, isLoading: false, query, users: [] });
          }
        }
      );
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [apiClient, query]);

  return state.query === query
    ? state
    : { error: null, isLoading: !!query.trim(), query, users: [] };
}
