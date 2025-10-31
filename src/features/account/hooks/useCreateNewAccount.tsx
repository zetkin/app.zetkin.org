import { useState } from 'react';

import { useApiClient } from 'core/hooks';
import { ApiClientError } from 'core/api/errors';
import { RegisterData } from '../components/RegisterFormSection';
import { CreateNewAccountStatus } from '../types';

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
      await apiClient.post(`/api/users`, {
        ...formData,
      });
      return { success: true };
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.status == 409) {
          return { errorCode: 'conflictError', success: false };
        }
        if (err.status == 400) {
          return {
            errorCode: 'invalidParameter',
            success: false,
          };
        }
      }
      return { errorCode: 'unknownError', success: false };
    } finally {
      setLoading(false);
    }
  };
  return { createNewAccount, loading };
}
