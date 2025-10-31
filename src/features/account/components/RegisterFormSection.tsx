import { FC, useState } from 'react';
import { Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

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
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
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
                if (!formData.email.includes('@')) {
                  setEmailError(messages.lostPassword.errors.invalidEmail());
                  return;
                }
                setEmailError(null);

                if (formData.password.length < 6) {
                  setPasswordError(true);
                  return;
                }

                if (isTermsAccepted) {
                  const result = await createNewAccount(formData);

                  if (result.success) {
                    onSuccess(formData.first_name, formData.email);
                  } else {
                    if (result.errorCode == 'REGISTRATION_FAILED') {
                      setResultError('REGISTRATION_FAILED');
                    } else if (result.errorCode == 'CONFLICT_ERROR') {
                      setResultError('CONFLICT_ERROR');
                    } else if (result.errorCode == 'INVALID_PARAMETER') {
                      setResultError('INVALID_PARAMETER');
                    } else {
                      setResultError('UNKNOWN_ERROR');
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
                  {(resultError === 'CONFLICT_ERROR' ||
                    resultError === 'INVALID_PARAMETER' ||
                    resultError === 'UNKNOWN_ERROR') && (
                    <Box sx={{ mb: 2 }}>
                      {resultError == 'CONFLICT_ERROR' && (
                        <ZUIAlert
                          appear
                          severity={'error'}
                          title={messages.register.error.conflictError()}
                        />
                      )}
                      {resultError == 'UNKNOWN_ERROR' && (
                        <ZUIAlert
                          appear
                          severity={'error'}
                          title={messages.register.error.unkownError()}
                        />
                      )}
                      {resultError == 'INVALID_PARAMETER' && (
                        <ZUIAlert
                          appear
                          severity={'error'}
                          title={messages.register.error.invalidParameter()}
                        />
                      )}
                    </Box>
                  )}
                  <ZUITextField
                    error={Boolean(emailError)}
                    fullWidth
                    helperText={
                      emailError
                        ? messages.lostPassword.errors.invalidEmail()
                        : ''
                    }
                    label={messages.register.labels.email()}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, email: value }));
                      setEmailError(null);
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
                    error={Boolean(phoneError)}
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
