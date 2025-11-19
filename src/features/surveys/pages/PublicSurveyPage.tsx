'use client';

import {
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
// TODO: Remove comment once we upgrade to React 19
// Type definitions for useFormState don't exist in React 18
// because it's an experimental feature. That's why we silence
// the Typescript warning.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useFormState } from 'react-dom';

import { Msg, useMessages } from 'core/i18n';
import SurveyForm from 'features/surveys/components/SurveyForm';
import useIsMobile from 'utils/hooks/useIsMobile';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
  ZetkinSurveySignatureType,
  ZetkinUser,
} from 'utils/types/zetkin';
import ZUIAlert from 'zui/components/ZUIAlert';
import ZUIButton from 'zui/components/ZUIButton';
import ZUILink from 'zui/components/ZUILink';
import ZUIPublicSurveyOption from 'zui/components/ZUIPublicSurveyOption';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';
import { submit } from '../actions/submit';
import messageIds from '../l10n/messageIds';

type PublicSurveyPageProps = {
  survey: ZetkinSurveyExtended;
  user: ZetkinUser | null;
};

const PublicSurveyPage: FC<PublicSurveyPageProps> = ({ survey, user }) => {
  const messages = useMessages(messageIds);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [signatureType, setSignatureType] = useState<
    ZetkinSurveySignatureType | undefined
  >(undefined);
  const [status, action] = useFormState<ZetkinSurveyFormStatus>(
    submit,
    'editing'
  );

  const handleRadioChange = useCallback(
    (value: ZetkinSurveySignatureType) => {
      setSignatureType(value);
    },
    [setSignatureType]
  );

  const errorMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (errorMessageRef.current) {
      errorMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errorMessageRef.current]);

  useEffect(() => {
    if (status == 'submitted' || status == 'error') {
      setIsLoading(false);
    }
  }, [status]);

  const showForm = status == 'editing' || status == 'error';
  const showSuccess = status == 'submitted';
  const showErrorAlert = status == 'error';

  const privacyUrl =
    process.env.ZETKIN_PRIVACY_POLICY_LINK || 'https://zetkin.org/privacy';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box
        sx={{
          maxWidth: isMobile ? '100dvw' : '37.5rem',
        }}
      >
        {showErrorAlert && (
          <Box ref={errorMessageRef} data-testid="Survey-error" role="alert">
            <ZUIAlert severity="error" title={messages.surveyForm.error()} />
          </Box>
        )}
        {showForm && (
          <form
            action={action as unknown as string}
            onSubmit={() => {
              setIsLoading(true);
            }}
          >
            <input name="orgId" type="hidden" value={survey.organization.id} />
            <input name="surveyId" type="hidden" value={survey.id} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1rem',
              }}
            >
              <SurveyForm survey={survey} />
              <FormControl fullWidth>
                <RadioGroup
                  aria-labelledby="survey-signature"
                  name="sig"
                  onChange={(e) =>
                    handleRadioChange(
                      e.target.value as ZetkinSurveySignatureType
                    )
                  }
                >
                  <Box display="flex" flexDirection="column" gap={1}>
                    <FormLabel id="survey-signature">
                      <ZUIText variant="headingMd">
                        <Msg id={messageIds.surveySignature.title} />
                      </ZUIText>
                    </FormLabel>
                    <Box display="flex" flexDirection="column" rowGap={1}>
                      {user && (
                        <ZUIPublicSurveyOption
                          control={<Radio required />}
                          label={
                            <Msg
                              id={messageIds.surveySignature.type.user}
                              values={{
                                email: user.email,
                                person: user.first_name,
                              }}
                            />
                          }
                          value="user"
                        />
                      )}
                      <ZUIPublicSurveyOption
                        control={<Radio required />}
                        label={
                          <Msg id={messageIds.surveySignature.type.email} />
                        }
                        value="email"
                      />
                      {signatureType === 'email' && (
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={1}
                          pt={1}
                        >
                          <ZUITextField
                            label={messages.surveySignature.email.firstName()}
                            name="sig.first_name"
                            required
                            size="large"
                          />
                          <ZUITextField
                            label={messages.surveySignature.email.lastName()}
                            name="sig.last_name"
                            required
                            size="large"
                          />
                          <ZUITextField
                            label={messages.surveySignature.email.email()}
                            name="sig.email"
                            required
                            size="large"
                          />
                        </Box>
                      )}
                      {survey.signature == 'allow_anonymous' && (
                        <ZUIPublicSurveyOption
                          control={<Radio required />}
                          label={
                            <Msg
                              id={messageIds.surveySignature.type.anonymous}
                            />
                          }
                          value="anonymous"
                        />
                      )}
                    </Box>
                  </Box>
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth>
                <FormGroup
                  aria-labelledby="privacy-policy-label"
                  data-testid="privacy-policy"
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
                  <ZUIPublicSurveyOption
                    control={<Checkbox required />}
                    data-testid="Survey-acceptTerms"
                    label={<Msg id={messageIds.surveyForm.accept} />}
                    name="privacy.approval"
                  />
                  <ZUIText>
                    <Msg
                      id={messageIds.surveyForm.terms.description}
                      values={{ organization: survey.organization.title }}
                    />
                  </ZUIText>
                  <ZUILink
                    href={privacyUrl}
                    text={messages.surveyForm.policy.text()}
                  />
                </FormGroup>
              </FormControl>
              <ZUIButton
                actionType="submit"
                dataTestId="Survey-submit"
                label={messages.surveyForm.submit()}
                size="large"
                variant={isLoading ? 'loading' : 'primary'}
              />
            </Box>
          </form>
        )}
        {showSuccess && (
          <ZUIAlert
            button={{
              label: messages.surveyFormSubmitted.retakeSurvey(),
              onClick: () => {
                location.reload();
              },
            }}
            description={messages.surveyFormSubmitted.text({
              title: survey.title,
            })}
            severity="success"
            title={messages.surveyFormSubmitted.title()}
          />
        )}
      </Box>
    </Box>
  );
};

export default PublicSurveyPage;
