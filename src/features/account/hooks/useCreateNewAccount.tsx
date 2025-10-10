import { useState } from 'react';

import { useApiClient } from 'core/hooks';
import { ApiClientError } from 'core/api/errors';
import { RegisterData } from '../components/RegisterFormSection';

export type CreateNewAccountStatus = {
  errorCode?: string;
  success: boolean;
};

type UseCreateNewAccountProps = {
  createNewAccount: (formData: RegisterData) => Promise<CreateNewAccountStatus>;
  loading: boolean;
};

export function useCreateNewAccount(): UseCreateNewAccountProps {
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);

  const createNewAccount = async (
    formData: RegisterData
  ): Promise<CreateNewAccountStatus> => {
    setLoading(true);
    try {
      await apiClient.post(`https://api.zetk.in/v1/users`, {
        ...formData,
      });
      return { success: true };
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.status == 409) {
          return { errorCode: 'CONFLICT_ERROR', success: false };
        }
        if (err.status == 400) {
          return {
            errorCode: 'INVALID_PARAMETER',
            success: false,
          };
        }
      }
      return { errorCode: 'UNKNOWN_ERROR', success: false };
    } finally {
      setLoading(false);
    }
  };
  return { createNewAccount, loading };
}
