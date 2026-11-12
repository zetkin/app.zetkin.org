import { useEffect, useState } from 'react';

import useApiClient from 'core/hooks/useApiClient';
import searchOrganizations from '../rpc/searchOrganizations';
import { ZetkinOrganization } from 'utils/types/zetkin';

export default function useOrganizationSearch(query: string) {
  const apiClient = useApiClient();
  const [state, setState] = useState<{
    error: unknown;
    isLoading: boolean;
    organizations: ZetkinOrganization[];
    query: string;
  }>({ error: null, isLoading: !!query.trim(), organizations: [], query });

  useEffect(() => {
    if (!query.trim()) {
      setState({ error: null, isLoading: false, organizations: [], query });
      return;
    }

    let cancelled = false;
    setState({ error: null, isLoading: true, organizations: [], query });

    const timeout = setTimeout(() => {
      apiClient.rpc(searchOrganizations, { query }).then(
        (organizations) => {
          if (!cancelled) {
            setState({ error: null, isLoading: false, organizations, query });
          }
        },
        (error: unknown) => {
          if (!cancelled) {
            setState({ error, isLoading: false, organizations: [], query });
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
    : { error: null, isLoading: !!query.trim(), organizations: [], query };
}
