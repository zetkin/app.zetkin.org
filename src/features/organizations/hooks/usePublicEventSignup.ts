import { useState } from 'react';

import { ZetkinEventWithStatus } from 'features/home/types';
import { ApiClientError } from 'core/api/errors';
import { useApiClient } from 'core/hooks';

type SubmitInput = {
  email?: string;
  firstName: string;
  gdprConsent: boolean;
  lastName: string;
  phone?: string;
};

type UsePublicEventSignupOptions = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
  signupErrorMessage: string;
  signupFailedMessage: string;
};

export default function usePublicEventSignup(
  event: ZetkinEventWithStatus,
  options: UsePublicEventSignupOptions
) {
  const apiClient = useApiClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (input: SubmitInput) => {
    setIsSubmitting(true);

    try {
      await apiClient.post(
        `/beta/orgs/${event.organization.id}/events/${event.id}`,
        {
          email: input.email,
          first_name: input.firstName,
          gdpr_consent: input.gdprConsent,
          last_name: input.lastName,
          phone: input.phone,
        }
      );
      options.onSuccess?.();
    } catch (e) {
      if (e instanceof ApiClientError && e.status === 400) {
        options.onError?.(options.signupErrorMessage);
      } else {
        options.onError?.(options.signupFailedMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submit };
}
