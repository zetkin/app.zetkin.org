'use client';

import { FC, useState } from 'react';
import { Box } from '@mui/system';
import { FormControl, FormGroup, FormLabel } from '@mui/material';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import isEmail from 'validator/lib/isEmail';

import { Msg, useMessages } from 'core/i18n';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUICheckbox from 'zui/components/ZUICheckbox';
import ZUIText from 'zui/components/ZUIText';
import ZUILink from 'zui/components/ZUILink';
import { ZetkinEventWithStatus } from 'features/home/types';
import usePublicEventSignup from 'features/organizations/hooks/usePublicEventSignup';
import messageIds from 'features/surveys/l10n/messageIds';
import eventMessageIds from 'features/events/l10n/messageIds';

type Props = {
  event: ZetkinEventWithStatus;
  onSignupSuccess?: () => void;
};

export const PublicEventSignup: FC<Props> = ({ event, onSignupSuccess }) => {
  const messages = useMessages(messageIds);
  const eventMessages = useMessages(eventMessageIds);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const privacyUrl =
    process.env.ZETKIN_PRIVACY_POLICY_LINK || 'https://zetkin.org/privacy';

  const { isSubmitting, submit } = usePublicEventSignup(event, {
    onError: setError,
    onSuccess: () => {
      setSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setGdprConsent(false);
      onSignupSuccess?.();
    },
    signupErrorMessage: eventMessages.publicEventSignup.errors.signupError(),
    signupFailedMessage: eventMessages.publicEventSignup.errors.signupFailed(),
  });

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError(eventMessages.publicEventSignup.errors.nameRequired());
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail && !trimmedPhone) {
      setError(eventMessages.publicEventSignup.errors.emailOrPhoneRequired());
      return;
    }

    if (trimmedEmail && !isEmail(trimmedEmail)) {
      setError(eventMessages.publicEventSignup.errors.invalidEmail());
      return;
    }

    let normalizedPhone: string | null = null;
    if (trimmedPhone) {
      const parsed = parsePhoneNumberFromString(trimmedPhone);
      if (!parsed || !parsed.isValid()) {
        setError(eventMessages.publicEventSignup.errors.phoneFormat());
        return;
      }
      normalizedPhone = parsed.number;
    }

    if (!gdprConsent) {
      setError(eventMessages.publicEventSignup.errors.gdprConsentRequired());
      return;
    }

    setError(null);
    await submit({
      email: trimmedEmail || undefined,
      firstName: firstName.trim(),
      gdprConsent,
      lastName: lastName.trim(),
      phone: normalizedPhone || undefined,
    });
  };

  if (success) {
    return (
      <ZUIAlert
        description={eventMessages.publicEventSignup.alert.thankYou()}
        severity="success"
        title={eventMessages.publicEventSignup.alert.signupSuccessful()}
      />
    );
  }

  const emailOrPhoneErrorMessages = [
    eventMessages.publicEventSignup.errors.emailOrPhoneRequired(),
    eventMessages.publicEventSignup.errors.invalidEmail(),
    eventMessages.publicEventSignup.errors.phoneFormat(),
  ];
  const isEmailOrPhoneError =
    error !== null && emailOrPhoneErrorMessages.includes(error);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {!isEmailOrPhoneError && (
        <ZUIAlert
          description={eventMessages.publicEventSignup.info.description()}
          severity="info"
          title={eventMessages.publicEventSignup.info.title()}
        />
      )}
      {error && (
        <ZUIAlert
          description={error}
          severity="error"
          title={eventMessages.publicEventSignup.alert.error()}
        />
      )}
      <ZUITextField
        fullWidth
        label={eventMessages.publicEventSignup.fields.firstName()}
        onChange={setFirstName}
        required
        value={firstName}
      />
      <ZUITextField
        fullWidth
        label={eventMessages.publicEventSignup.fields.lastName()}
        onChange={setLastName}
        required
        value={lastName}
      />
      <ZUITextField
        fullWidth
        label={eventMessages.publicEventSignup.fields.phone()}
        onChange={setPhone}
        value={phone}
      />
      <ZUITextField
        fullWidth
        label={eventMessages.publicEventSignup.fields.email()}
        onChange={setEmail}
        value={email}
      />
      <FormControl fullWidth>
        <FormGroup
          aria-labelledby="privacy-policy-label"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <FormLabel id="privacy-policy-label">
            <ZUIText variant="headingMd">
              <Msg id={messageIds.surveyForm.terms.title} />
            </ZUIText>
          </FormLabel>
          <ZUICheckbox
            checked={gdprConsent}
            label={messages.surveyForm.accept()}
            onChange={setGdprConsent}
          />
          <ZUIText>
            <Msg
              id={eventMessageIds.publicEventSignup.privacyPolicy}
              values={{ organization: event.organization.title }}
            />
          </ZUIText>
          <ZUILink href={privacyUrl} text={messages.surveyForm.terms.title()} />
        </FormGroup>
      </FormControl>
      <ZUIButton
        disabled={isSubmitting}
        fullWidth
        label={
          isSubmitting
            ? eventMessages.publicEventSignup.submit.submitting()
            : eventMessages.publicEventSignup.submit.button()
        }
        onClick={handleSubmit}
        size="large"
        variant="primary"
      />
    </Box>
  );
};
