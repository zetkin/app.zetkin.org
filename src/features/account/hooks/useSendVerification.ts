import { useState } from 'react';

import { useApiClient } from 'core/hooks';

export type SendVerificationStatus = {
  errorCode?: string;
  success: boolean;
};

type UseSendVerificationProps = {
  loading: boolean;
  sendVerification: () => Promise<SendVerificationStatus>;
};

export function UseSendVerification(): UseSendVerificationProps {
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);

  const sendVerification = async (): Promise<SendVerificationStatus> => {
    setLoading(true);
    try {
      await apiClient.post(`https://www.zetk.in/verify/resend`, {});
      return { success: true };
    } catch (err) {
      return { errorCode: 'UNKNOWN_ERROR', success: false };
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendVerification };
}
