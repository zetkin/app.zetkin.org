import { useState } from 'react';

import { useApiClient, useNumericRouteParams } from 'core/hooks';
import { ZetkinUser } from '../../../utils/types/zetkin';

export default function useSendTestEmail() {
  const apiClient = useApiClient();
  const [isLoading, setIsLoading] = useState(false);
  const [emailWasSent, setEmailWasSent] = useState(false);

  const { emailId, orgId } = useNumericRouteParams();

  return {
    emailWasSent: emailWasSent,
    isLoading,
    reset: () => {
      setEmailWasSent(false);
    },
    sendTestEmail: async (recipient: ZetkinUser) => {
      setIsLoading(true);
      await apiClient.post(`/api/orgs/${orgId}/emails/${emailId}/preview`, {
        recipients: [
          {
            email: recipient.email,
            first_name: recipient.first_name,
            last_name: recipient.last_name,
          },
        ],
      });

      setIsLoading(false);
      setEmailWasSent(true);
    },
  };
}
