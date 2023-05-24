import { useApiClient } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { useEffect, useState } from 'react';

const useCurrentUser = (): [ZetkinUser | null, boolean] => {
  const [user, setUser] = useState<ZetkinUser | null>(null);
  const [loading, setLoading] = useState(true);

  const apiClient = useApiClient();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await apiClient.get<ZetkinUser>(`/api/users/me`);

      setUser(response);
      setLoading(false);
    };
    fetchCurrentUser();
  }, []);

  return [user, loading];
};

export default useCurrentUser;
