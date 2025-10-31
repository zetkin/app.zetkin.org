import { FC, useState } from 'react';
import { Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import isEmail from 'validator/lib/isEmail';

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
import ZUIAlert from 'zui/components/ZUIAlert';
import { ErrorCode } from '../types';

export type RegisterData = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
};

type RegisterFormSectionProps = {
  onSuccess: (first_name: string, email: string) => void;
};

const RegisterFormSection: FC<RegisterFormSectionProps> = ({ onSuccess }) => {
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);
  const { loading, createNewAccount } = useCreateNewAccount();

  const [showExtraFields, setShowExtraFields] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [resultError, setResultError] = useState<ErrorCode | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
  });

  const allFieldsFilled = Object.values(formData).every(
    (value) => value.trim() !== ''
  );

  const showErrorMessage =
    resultError == 'conflictError' ||
    resultError == 'invalidParameter' ||
    resultError == 'unknownError';

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
              gap: 2,
              justifyContent: 'space-between',
              minHeight: isMobile ? '90vh' : '60vh',
            }}
          >
            <form
              onSubmit={async (ev) => {
                ev.preventDefault();
                if (!isEmail(formData.email)) {
                  setEmailError(true);
                } else {
                  setEmailError(false);

                  if (formData.password.length < 6) {
                    setPasswordError(true);
                  } else {
                    if (isTermsAccepted) {
                      const result = await createNewAccount(formData);

                      if (result.success) {
                        onSuccess(formData.first_name, formData.email);
                      } else if (result.errorCode) {
                        setResultError(result.errorCode);
                      }
                    }
                  }
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  gap: showExtraFields ? 2 : 1,
                  pt: resultError ? 0 : 1,
                }}
              >
                <Box
                  onClick={() => setShowExtraFields(true)}
                  sx={{ overflow: 'visible' }}
                  width="100%"
                >
                  {showErrorMessage && (
                    <Box sx={{ mb: 2 }}>
                      <ZUIAlert
                        appear
                        severity={'error'}
                        title={messages.register.error[resultError]()}
                      />
                    </Box>
                  )}
                  <ZUITextField
                    error={emailError}
                    fullWidth
                    helperText={
                      emailError
                        ? messages.lostPassword.errors.invalidEmail()
                        : ''
                    }
                    label={messages.register.labels.email()}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, email: value }));
                      setEmailError(false);
                    }}
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
                    overflow: showExtraFields ? 'visible' : 'hidden',
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
                  <MuiTelInput
                    defaultCountry="SE"
                    error={phoneError}
                    fullWidth
                    helperText={
                      phoneError ? messages.register.error.phoneError() : ''
                    }
                    label={messages.register.labels.mobile()}
                    onChange={(value) => {
                      setPhoneError(!matchIsValidTel(value));
                      setFormData((prev) => ({ ...prev, phone: value }));
                    }}
                    sx={(theme) => ({
                      '& .MuiFormHelperText-root': {
                        color: phoneError
                          ? theme.palette.error.main
                          : theme.palette.text.secondary,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.813rem',
                        fontWeight: 400,
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '1rem',
                        fontWeight: '500',
                      },
                    })}
                    value={formData.phone}
                  />
                  <ZUITextField
                    endIcon={showPassword ? VisibilityOff : Visibility}
                    error={passwordError}
                    fullWidth
                    helperText={
                      passwordError ? messages.resetPassword.validation() : ''
                    }
                    label={messages.register.labels.password()}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, password: value }));
                      setPasswordError(false);
                    }}
                    onEndIconClick={() => setShowPassword((prev) => !prev)}
                    size="large"
                    type={showPassword ? 'text' : 'password'}
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
                  disabled={loading || !isTermsAccepted || !allFieldsFilled}
                  label={messages.register.actions.createAccount()}
                  size="large"
                  variant={'primary'}
                />
              </Box>
            </form>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                gap: 2,
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
  );
};

export default RegisterFormSection;
