import { useState } from 'react';

import { ZetkinEventWithStatus } from 'features/home/types';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (input: SubmitInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/beta/orgs/${event.organization.id}/events/${event.id}`,
        {
          body: JSON.stringify({
            created: new Date().toISOString(),
            email: input.email,
            first_name: input.firstName,
            gdpr_consent: input.gdprConsent,
            last_name: input.lastName,
            phone: input.phone,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );

      if (!response.ok) {
        let errorMessage = options.signupFailedMessage;
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          errorMessage = options.signupErrorMessage;
        }

        options.onError?.(errorMessage);
        return;
      }

      options.onSuccess?.();
    } catch {
      options.onError?.(options.signupErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, submit };
}
