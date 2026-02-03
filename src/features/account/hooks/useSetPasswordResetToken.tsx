import { useState } from 'react';

import { useApiClient } from 'core/hooks';

export type SetPasswordResetTokenStatus = {
  errorCode?: string;
  success: boolean;
};

type UseSetPasswordResetTokenReturn = {
  loading: boolean;
  resetPassword: (newPassword: string) => Promise<SetPasswordResetTokenStatus>;
};

export function useSetPasswordResetToken(
  token: string,
  userId: string
): UseSetPasswordResetTokenReturn {
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);

  const resetPassword = async (
    password: string
  ): Promise<SetPasswordResetTokenStatus> => {
    setLoading(true);
    try {
      await apiClient.post(`/api/users/${userId}/password`, {
        new_password: password,
        reset_code: token,
      });
      return { success: true };
    } catch (err) {
      return { errorCode: 'UNKNOWN_ERROR', success: false };
    } finally {
      setLoading(false);
    }
  };

  return { loading, resetPassword };
}
