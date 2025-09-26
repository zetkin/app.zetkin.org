import NextLink from 'next/link';
import { Box } from '@mui/material';
import React, { FC, useState } from 'react';

import useIsMobile from 'utils/hooks/useIsMobile';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIDivider from 'zui/components/ZUIDivider';
import ZUILink from 'zui/components/ZUILink';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';
import ZUILogo from 'zui/ZUILogo';
import { useSendPasswordResetToken } from '../hooks/useSendPasswordResetToken';
import ZUIAlert from 'zui/components/ZUIAlert';

const LostPasswordSection: FC = () => {
  const isMobile = useIsMobile();
  const { sendPasswordResetToken, loading, error } =
    useSendPasswordResetToken();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<boolean>(false);
  return (
    <ZUISection
      borders={isMobile ? false : true}
      fullHeight
      renderContent={() => {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <form
              onSubmit={async (ev) => {
                ev.preventDefault();
                if (!email.includes('@')) {
                  setEmailError(true);
                  return;
                }
                setEmailError(false);
                sendPasswordResetToken(email);
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  gap: 2,
                  overflowY: { md: 'visible', xs: 'auto' },
                }}
              >
                <ZUIText variant="bodyMdRegular">
                  Have you forgotten your password for Zetkin? Give us your
                  e-mail address and we will send out a link where you can pick
                  a new password.
                </ZUIText>
                {emailError && (
                  <ZUIAlert
                    appear
                    description={'Please enter a valid email address.'}
                    severity={'error'}
                    title={'Invalid Email'}
                  />
                )}
                {error && <ZUIAlert appear severity={'error'} title={error} />}
                <ZUITextField
                  label={'Email'}
                  onChange={(newValue) => {
                    setEmail(newValue);
                    setEmailError(false);
                  }}
                  size="large"
                />
                <ZUIButton
                  actionType="submit"
                  disabled={loading || !!emailError || !email}
                  label={'Send Email'}
                  size="large"
                  variant={loading ? 'loading' : 'primary'}
                />
              </Box>
            </form>

            <Box
              sx={{
                bottom: { md: 'auto', xs: 0 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                left: { md: 'auto', xs: 0 },
                mt: { md: 25, xs: 0 },
                position: { md: 'static', xs: 'absolute' },
                px: isMobile ? 2 : 0,
                py: isMobile ? 2 : 0,
                right: { md: 'auto', xs: 0 },
              }}
            >
              <NextLink href={`https://login.zetk.in/`}>
                <ZUIButton
                  fullWidth
                  label={'Sign in'}
                  size="large"
                  variant="secondary"
                />
              </NextLink>
              <ZUIDivider />
              <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
              >
                <ZUIText>
                  <ZUILink
                    href={'https://zetkin.org/privacy'}
                    openInNewTab
                    text="Read our privacy policy"
                  />
                </ZUIText>
                <ZUIText>
                  <ZUILink
                    href={'https://zetkin.org/'}
                    openInNewTab
                    text="Zetkin.org"
                  />
                </ZUIText>
              </Box>
            </Box>
          </Box>
        );
      }}
      renderRightHeaderContent={() => {
        return <ZUILogo />;
      }}
      title={'Recover your Zetkin account'}
    />
  );
};

export default LostPasswordSection;
