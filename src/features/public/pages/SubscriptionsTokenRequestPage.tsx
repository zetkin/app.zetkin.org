'use client';

import isEmail from 'validator/lib/isEmail';
import { Box } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import ZUISection from 'zui/components/ZUISection';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIAlert from 'zui/components/ZUIAlert';

const SubscriptionsTokenRequestPage: FC = () => {
  const [email, setEmail] = useState('');
  const [emailValidationError, setEmailValidationError] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Currently only allows one submit per page load

  // Reset error state when retrying to type email
  useEffect(() => {
    if (emailValidationError) {
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
        <ZUISection
          renderContent={() => {
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  // Email validation
                  if (!isEmail(email)) {
                    setEmailValidationError(true);
                    return;
                  }

                  setSubmitted(true);
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <ZUITextField
                    disabled={submitted}
                    error={emailValidationError}
                    helperText={
                      emailValidationError
                        ? 'Email is not an email hehe'
                        : undefined
                    }
                    label="Your Email"
                    onChange={(newEmail) => setEmail(newEmail)}
                    value={email}
                  />

                  <ZUIButton
                    actionType="submit"
                    disabled={email.length === 0 || submitted}
                    label="Submit"
                    variant="primary"
                  />
                  {submitted && (
                    <ZUIAlert
                      description="If this email has an account, you will recieve a link to manage your subscription"
                      severity="success"
                      title="Submitted!"
                    />
                  )}
                </Box>
              </form>
            );
          }}
          subtitle="To manage your email subscriptions"
          title={`Request link`}
        />
      </Box>
    </Box>
  );
};

export default SubscriptionsTokenRequestPage;
