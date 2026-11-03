'use client';

import isEmail from 'validator/lib/isEmail';
import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import useEnv from 'core/hooks/useEnv';
import ZUISection from 'zui/components/ZUISection';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { stringToBool } from 'utils/stringUtils';
import { useApiClient } from 'core/hooks';

type Props = {
  org: ZetkinOrganization;
};

const SubscriptionsTokenRequestPage: FC<Props> = ({ org }) => {
  const [email, setEmail] = useState('');
  const [emailValidationError, setEmailValidationError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Currently only allows one submit per page load
  const [submissionError, setSubmissionError] = useState(false);
  const env = useEnv();
  const apiClient = useApiClient();

  // Reset error state when retrying to type email
  useEffect(() => {
    if (emailValidationError) {
      setSubmissionError(false);
      setEmailValidationError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'white',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ maxWidth: 430, p: 3, width: '100%' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
            mb: 2,
            px: '1.25rem',
          }}
        >
          <ZUIOrgLogoAvatar orgId={org.id} />
          <ZUIText variant="bodyMdSemiBold">{org.title}</ZUIText>
        </Box>
        <ZUISection
          renderContent={() => {
            return (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (!isEmail(email)) {
                    setEmailValidationError(true);
                    return;
                  }

                  const clientId = env.vars.ZETKIN_CLIENT_ID;
                  const ssl = stringToBool(env.vars.ZETKIN_USE_TLS);
                  const protocol = ssl ? 'https' : 'http';

                  const appHost = env.vars.ZETKIN_APP_HOST;
                  const linkUri = `${protocol}://${appHost}/email-auth?redir=/o/${org.id}/subscriptions`;

                  try {
                    setLoading(true);
                    await apiClient.post(`/api2/email_tokens`, {
                      client_id: clientId,
                      email,
                      link_uri: linkUri,
                      org_id: org.id,
                      scope: ['level1'],
                    });
                    throw new Error('Wrong');
                    setSuccess(true);
                  } catch {
                    setSubmissionError(true);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <ZUITextField
                    disabled={loading || success}
                    error={emailValidationError}
                    helperText={
                      emailValidationError ? 'Email is invalid' : undefined
                    }
                    label="Your Email"
                    onChange={(newEmail) => setEmail(newEmail)}
                    value={email}
                  />

                  <ZUIButton
                    actionType="submit"
                    disabled={email.length === 0 || success}
                    isLoading={loading}
                    label={success ? 'Link requested' : 'Request link'}
                    variant="primary"
                  />
                  {success && (
                    <ZUIAlert
                      button={{
                        label: 'Try again',
                        onClick: () => {
                          window.navigation.reload();
                        },
                      }}
                      description={`If ${email} has an account, you will recieve a link to manage your subscription. Please allow a few minutes to recieve the link before trying again`}
                      severity="success"
                      title="Submitted!"
                    />
                  )}
                  {submissionError && (
                    <ZUIAlert
                      description="Something went wrong when requesting an email, please try again!"
                      severity="error"
                      title="Error"
                    />
                  )}
                </Box>
              </form>
            );
          }}
          subtitle="Enter your email address to get a link to manage your subscriptions."
          title="Email settings"
        />
      </Box>
    </Box>
  );
};

export default SubscriptionsTokenRequestPage;
