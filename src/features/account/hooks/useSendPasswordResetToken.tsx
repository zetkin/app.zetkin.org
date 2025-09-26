import { useState } from 'react';

import { useApiClient } from 'core/hooks';
import { ApiClientError } from 'core/api/errors';

type UseSendPasswordResetTokenReturn = {
  error: string | null;
  loading: boolean;
  sendPasswordResetToken: (email: string) => Promise<void>;
};

export function useSendPasswordResetToken(): UseSendPasswordResetTokenReturn {
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPasswordResetToken = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/api/password_reset_tokens`, {
        email,
      });
    } catch (err) {
      if (err instanceof ApiClientError && err.status == 404) {
        setError('No user exists with that e-mail address.');
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, sendPasswordResetToken };
}
