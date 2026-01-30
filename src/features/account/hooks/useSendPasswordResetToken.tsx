import { useState } from 'react';

import { useApiClient } from 'core/hooks';
import { ApiClientError } from 'core/api/errors';
import { PasswordResetStatus } from '../types';

type UseSendPasswordResetTokenReturn = {
  loading: boolean;
  sendPasswordResetToken: (email: string) => Promise<PasswordResetStatus>;
};

export function useSendPasswordResetToken(): UseSendPasswordResetTokenReturn {
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);

  const sendPasswordResetToken = async (
    email: string
  ): Promise<PasswordResetStatus> => {
    setLoading(true);
    try {
      await apiClient.post(`/api/password_reset_tokens`, {
        email,
      });
      return { success: true };
    } catch (err) {
      if (err instanceof ApiClientError && err.status == 404) {
        return { success: true };
      }

      return { errorCode: 'unknownError', success: false };
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendPasswordResetToken };
}
