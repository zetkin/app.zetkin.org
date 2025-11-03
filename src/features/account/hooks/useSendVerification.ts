import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useApiClient } from 'core/hooks';
import { ZetkinUser } from 'utils/types/zetkin';
import { SendVerificationStatus } from '../types';

type UseSendVerificationProps = {
  loading: boolean;
  sendVerification: () => Promise<SendVerificationStatus>;
};

export function UseSendVerification(): UseSendVerificationProps {
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendVerification = async (): Promise<SendVerificationStatus> => {
    setLoading(true);
    try {
      const user: ZetkinUser = await apiClient.get(`/api/users/me`);
      if (user.email_is_verified) {
        router.push(process.env.ZETKIN_LOGIN_URL || 'https://login.zetk.in/');
      }

      await apiClient.post(`/api/users/me/verification_codes`, {});

      return {
        success: true,
      };
    } catch (err) {
      return { errorCode: 'unknownError', success: false };
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendVerification };
}
