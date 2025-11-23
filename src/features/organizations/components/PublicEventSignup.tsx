'use client';

import { FC, useState } from 'react';
import { Box } from '@mui/system';
import { FormControl, FormGroup, FormLabel } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUICheckbox from 'zui/components/ZUICheckbox';
import ZUIText from 'zui/components/ZUIText';
import ZUILink from 'zui/components/ZUILink';
import { ZetkinEventWithStatus } from 'features/home/types';
import messageIds from 'features/surveys/l10n/messageIds';

type Props = {
  event: ZetkinEventWithStatus;
};

export const PublicEventSignup: FC<Props> = ({ event }) => {
  const messages = useMessages(messageIds);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const privacyUrl =
    process.env.ZETKIN_PRIVACY_POLICY_LINK || 'https://zetkin.org/privacy';

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    const contactTrimmed = contact.trim();
    if (!contactTrimmed) {
      setError('Either email or phone is required');
      return;
    }

    const hasAtSymbol = contactTrimmed.includes('@');
    const hasDigits = /\d/.test(contactTrimmed);

    if (!hasAtSymbol && !hasDigits) {
      setError('Please provide a valid email or phone number');
      return;
    }

    if (!gdprConsent) {
      setError('GDPR consent is required');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const body: {
        email?: string;
        first_name: string;
        gdpr_consent: boolean;
        last_name: string;
        phone?: string;
      } = {
        first_name: firstName.trim(),
        gdpr_consent: gdprConsent,
        last_name: lastName.trim(),
      };

      if (hasAtSymbol) {
        body.email = contactTrimmed;
      } else {
        body.phone = contactTrimmed;
      }

      const response = await fetch(
        `/beta/orgs/${event.organization.id}/events/${event.id}`,
        {
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to sign up');
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setFirstName('');
      setLastName('');
      setContact('');
      setGdprConsent(false);
    } catch (err) {
      setError('An error occurred while signing up');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <ZUIAlert
        description="Thank you for signing up!"
        severity="success"
        title="Signup successful"
      />
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {error && <ZUIAlert description={error} severity="error" title="Error" />}
      <ZUITextField
        fullWidth
        label="First name"
        onChange={setFirstName}
        required
        value={firstName}
      />
      <ZUITextField
        fullWidth
        label="Last name"
        onChange={setLastName}
        required
        value={lastName}
      />
      <ZUITextField
        fullWidth
        label="Email or Phone"
        onChange={setContact}
        required
        value={contact}
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
              id={messageIds.surveyForm.terms.description}
              values={{ organization: event.organization.title }}
            />
          </ZUIText>
          <ZUILink href={privacyUrl} text={messages.surveyForm.policy.text()} />
        </FormGroup>
      </FormControl>
      <ZUIButton
        disabled={isSubmitting}
        label={isSubmitting ? 'Submitting...' : 'Sign up'}
        onClick={handleSubmit}
        size="large"
        variant="primary"
      />
    </Box>
  );
};
