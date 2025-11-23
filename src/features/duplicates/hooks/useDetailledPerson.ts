import { useState, useEffect } from 'react';

import { useApiClient } from 'core/hooks';
import loadDetailledPerson from '../rpc/loadDetailledPerson';
import { ZetkinPerson } from 'utils/types/zetkin';

export default function useDetailledPersons(
  orgId: number,
  personIds: number[]
) {
  const apiClient = useApiClient();
  const [detailledPersons, setDetailledPersons] = useState<ZetkinPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (personIds.length === 0) {
      return;
    }

    const fetchPersons = async () => {
      setLoading(true);
      try {
        const result = await apiClient.rpc(loadDetailledPerson, {
          orgId,
          personIds,
        });
        setDetailledPersons(result.detailledPersons);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, [orgId, personIds.join(','), apiClient]);

  return { detailledPersons, error, loading };
}
