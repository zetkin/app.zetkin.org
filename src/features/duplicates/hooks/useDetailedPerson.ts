import { useState, useEffect } from 'react';

import { useApiClient } from 'core/hooks';
import loadDetailedPerson from '../rpc/loadDetailedPerson';
import { ZetkinPerson } from 'utils/types/zetkin';

export default function useDetailedPersons(orgId: number, personIds: number[]) {
  const apiClient = useApiClient();
  const [detailedPersons, setDetailedPersons] = useState<ZetkinPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (personIds.length === 0) {
      return;
    }

    const fetchPersons = async () => {
      setLoading(true);
      try {
        const result = await apiClient.rpc(loadDetailedPerson, {
          orgId,
          personIds,
        });
        setDetailedPersons(result.detailedPersons);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, [orgId, personIds.join(','), apiClient]);

  return { detailedPersons: detailedPersons, error, loading };
}
