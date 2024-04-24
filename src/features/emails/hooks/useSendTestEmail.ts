import { useState } from 'react';

import { useUser } from 'utils/hooks/useFocusDate';
import { useApiClient, useNumericRouteParams } from 'core/hooks';

export default function useSendTestEmail() {
  const apiClient = useApiClient();
  const [isLoading, setIsLoading] = useState(false);
  const [emailWasSent, setEmailWasSent] = useState(false);

  // TODO: Get these as props instead
  const user = useUser();
  if (!user) {
    // This should never happen on pages where this hook is used
    throw new Error('Sending test email only works for signed in users');
  }

  const { emailId, orgId } = useNumericRouteParams();

  return {
    emailWasSent: emailWasSent,
    isLoading,
    reset: () => {
      setEmailWasSent(false);
    },
    sendTestEmail: async () => {
      setIsLoading(true);
      await apiClient.post(`/api/orgs/${orgId}/emails/${emailId}/preview`, {
        recipients: [
          {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
          },
        ],
      });

      setIsLoading(false);
      setEmailWasSent(true);
    },
  };
}
