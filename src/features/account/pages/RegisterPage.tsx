'use client';

import { FC, Suspense, useState } from 'react';
import { Box } from '@mui/material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUISection from 'zui/components/ZUISection';
import ZUIButton from 'zui/components/ZUIButton';
import ZUITextField from 'zui/components/ZUITextField';
import AccountFooter from '../components/AccountFooter';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import ZUILogo from 'zui/ZUILogo';
import ZUICheckbox from 'zui/components/ZUICheckbox';
import { useCreateNewAccount } from '../hooks/useCreateNewAccount';

export type RegisterData = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
};

const RegisterPage: FC = () => {
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);
  const { loading, createNewAccount } = useCreateNewAccount();
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
  });

  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
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
                  if (isTermsAccepted) {
                    await createNewAccount(formData);
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    gap: showExtraFields ? 2 : 1,
                    overflowY: { md: 'visible', xs: 'auto' },
                  }}
                >
                  <Box onClick={() => setShowExtraFields(true)} width="100%">
                    <ZUITextField
                      fullWidth
                      label={messages.register.labels.email()}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, email: value }))
                      }
                      size="large"
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: showExtraFields ? 2 : 0,
                      height: showExtraFields ? 'auto' : 0,
                      opacity: showExtraFields ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'opacity 2s ease, height 2s ease',
                    }}
                  >
                    <ZUITextField
                      fullWidth
                      label={messages.register.labels.firstName()}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, first_name: value }))
                      }
                      size="large"
                    />
                    <ZUITextField
                      fullWidth
                      label={messages.register.labels.lastName()}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, last_name: value }))
                      }
                      size="large"
                    />
                    <ZUITextField
                      fullWidth
                      label={messages.register.labels.mobile()}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, phone: value }))
                      }
                      size="large"
                    />
                    <ZUITextField
                      fullWidth
                      label={messages.register.labels.password()}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, password: value }))
                      }
                      size="large"
                    />
                    <ZUICheckbox
                      checked={isTermsAccepted}
                      label={messages.register.labels.checkBox()}
                      onChange={(newValue) => setIsTermsAccepted(newValue)}
                      size="large"
                    />
                  </Box>
                  <ZUIButton
                    actionType="submit"
                    disabled={loading || !isTermsAccepted}
                    label={messages.register.actions.createAccount()}
                    size="large"
                    variant={'primary'}
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
                <AccountFooter />
              </Box>
            </Box>
          );
        }}
        renderRightHeaderContent={() => {
          return <ZUILogo />;
        }}
        subtitle={messages.register.description()}
        title={messages.register.title()}
      />
    </Suspense>
  );
};

export default RegisterPage;
