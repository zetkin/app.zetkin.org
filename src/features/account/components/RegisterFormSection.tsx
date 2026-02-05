import { FC, useState } from 'react';
import { Box, Collapse } from '@mui/material';
import { useIntl } from 'react-intl';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import isEmail from 'validator/lib/isEmail';

import ZUIButton from 'zui/components/ZUIButton';
import ZUITextField from 'zui/components/ZUITextField';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import ZUICheckbox from 'zui/components/ZUICheckbox';
import { useCreateNewAccount } from '../hooks/useCreateNewAccount';
import ZUIAlert from 'zui/components/ZUIAlert';
import { CreateAccountErrorCode } from '../types';
import ResponsiveAccountSection from './ResponsiveAccountSection';

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
  const messages = useMessages(messageIds);
  const { loading, createNewAccount } = useCreateNewAccount();
  const intl = useIntl();

  const [showExtraFields, setShowExtraFields] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [resultError, setResultError] = useState<CreateAccountErrorCode | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '+',
  });

  const allFieldsFilled = Object.values(formData).every(
    (value) => value.trim() !== ''
  );

  const showErrorMessage =
    resultError == 'conflictError' ||
    resultError == 'invalidParameter' ||
    resultError == 'unknownError';

  return (
    <ResponsiveAccountSection
      renderContent={() => (
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
            onFocus={() => {
              setShowExtraFields(true);
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              paddingBottom: 2,
              width: '100%',
            }}
          >
            {showErrorMessage && (
              <ZUIAlert
                appear
                severity={'error'}
                title={messages.register.error[resultError]()}
              />
            )}
            <ZUITextField
              error={emailError}
              fullWidth
              helperText={
                emailError ? messages.lostPassword.errors.invalidEmail() : ''
              }
              label={messages.register.labels.email()}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, email: value }));
                setEmailError(false);
              }}
              size="large"
            />
          </Box>
          <Collapse in={showExtraFields}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                paddingBottom: 2,
                width: '100%',
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
                error={phoneError}
                fullWidth
                helperText={
                  phoneError ? messages.register.error.phoneError() : ''
                }
                label={messages.register.labels.mobile()}
                langOfCountryName={intl.locale}
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
          </Collapse>
          <ZUIButton
            actionType="submit"
            disabled={loading || !isTermsAccepted || !allFieldsFilled}
            label={messages.register.actions.createAccount()}
            size="large"
            variant={'primary'}
          />
        </form>
      )}
      subtitle={messages.register.description()}
      title={messages.register.title()}
    />
  );
};

export default RegisterFormSection;
