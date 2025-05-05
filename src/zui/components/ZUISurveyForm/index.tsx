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
// Type definitions for the new experimental stuff like useFormState in
// react-dom are lagging behind the implementation so it's necessary to silence
// the TypeScript error about the lack of type definitions here in order to
// import this.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useFormState } from 'react-dom';

import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
  ZetkinSurveyQuestionElement,
  ZetkinSurveySignatureType,
  ZetkinSurveyTextQuestionElement,
  ZetkinUser,
} from 'utils/types/zetkin';
import ZUIButton from '../ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'zui/l10n/messageIds';
import ZUIText from '../ZUIText';
import TextQuestion from './TextQuestion';
import OptionsQuestion from './OptionsQuestion';
import ZUILink from '../ZUILink';
import SurveyOption from './SurveyOption';
import ZUITextField from '../ZUITextField';
import useServerSide from 'core/useServerSide';
import ZUIAlert from '../ZUIAlert';

type ZUISurveyFormProps = {
  onSubmit: (
    prevState: ZetkinSurveyFormStatus,
    formData: FormData
  ) => Promise<ZetkinSurveyFormStatus>;
  survey: ZetkinSurveyExtended;
  user: Pick<ZetkinUser, 'email' | 'first_name'> | null;
};

const isTextQuestionType = (
  question: ZetkinSurveyQuestionElement
): question is ZetkinSurveyTextQuestionElement => {
  return question.question.response_type == 'text';
};

const ZUISurveyForm: FC<ZUISurveyFormProps> = ({ onSubmit, survey, user }) => {
  const messages = useMessages(messageIds);
  const [status, action] = useFormState<ZetkinSurveyFormStatus>(
    onSubmit,
    'editing'
  );
  const [signatureType, setSignatureType] = useState<
    ZetkinSurveySignatureType | undefined
  >(undefined);

  const errorMessageRef = useRef<HTMLDivElement | null>(null);
  const handleRadioChange = useCallback(
    (value: ZetkinSurveySignatureType) => {
      setSignatureType(value);
    },
    [setSignatureType]
  );

  useEffect(() => {
    if (errorMessageRef.current) {
      errorMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const privacyUrl =
    process.env.ZETKIN_PRIVACY_POLICY_LINK || messages.privacyPolicyLink();

  const showForm = status == 'editing' || status == 'error';
  const showSuccess = status == 'submitted';
  const showErrorAlert = status == 'error';

  const isServer = useServerSide();
  if (isServer) {
    return null;
  }

  return (
    <>
      {showErrorAlert && (
        <Box ref={errorMessageRef} data-testid="Survey-error" role="alert">
          <ZUIAlert severity="error" title={messages.surveyForm.error()} />
        </Box>
      )}
      {showForm && (
        <form action={action as unknown as string}>
          <input name="orgId" type="hidden" value={survey.organization.id} />
          <input name="surveyId" type="hidden" value={survey.id} />
          <Box display="flex" flexDirection="column" gap={4} paddingX={2}>
            <Box display="flex" flexDirection="column" gap={4}>
              {survey.elements
                .filter((element) => element.hidden !== true)
                .map((element) => {
                  const isTextBlock = element.type == 'text';
                  const isTextQuestion =
                    !isTextBlock && isTextQuestionType(element);
                  const isOptionsQuestion = !isTextBlock && !isTextQuestion;

                  return (
                    <Box key={element.id}>
                      {isTextBlock && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                          }}
                        >
                          <ZUIText variant="headingMd">
                            {element.text_block.header}
                          </ZUIText>
                          <ZUIText>{element.text_block.content}</ZUIText>
                        </Box>
                      )}
                      {isTextQuestion && <TextQuestion element={element} />}
                      {isOptionsQuestion && (
                        <OptionsQuestion element={element} />
                      )}
                    </Box>
                  );
                })}
            </Box>
            <FormControl fullWidth>
              <RadioGroup
                aria-labelledby="survey-signature"
                name="sig"
                onChange={(e) =>
                  handleRadioChange(e.target.value as ZetkinSurveySignatureType)
                }
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <FormLabel id="survey-signature">
                    <ZUIText variant="headingMd">
                      <Msg id={messageIds.surveyForm.signature.title} />
                    </ZUIText>
                  </FormLabel>
                  <Box display="flex" flexDirection="column" rowGap={1}>
                    {user && (
                      <SurveyOption
                        control={<Radio required />}
                        label={
                          <Msg
                            id={messageIds.surveyForm.signature.type.user}
                            values={{
                              email: user.email,
                              person: user.first_name,
                            }}
                          />
                        }
                        value="user"
                      />
                    )}
                    <SurveyOption
                      control={<Radio required />}
                      label={
                        <Msg id={messageIds.surveyForm.signature.type.email} />
                      }
                      value="email"
                    />
                    {signatureType === 'email' && (
                      <Box display="flex" flexDirection="column" gap={1} pt={1}>
                        <ZUITextField
                          label={messages.surveyForm.signature.email.firstName()}
                          name="sig.first_name"
                          required
                          size="large"
                        />
                        <ZUITextField
                          label={messages.surveyForm.signature.email.lastName()}
                          name="sig.last_name"
                          required
                          size="large"
                        />
                        <ZUITextField
                          label={messages.surveyForm.signature.email.email()}
                          name="sig.email"
                          required
                          size="large"
                        />
                      </Box>
                    )}
                    {survey.signature === 'allow_anonymous' && (
                      <SurveyOption
                        control={<Radio required />}
                        label={
                          <Msg
                            id={messageIds.surveyForm.signature.type.anonymous}
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
                sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <FormLabel id="privacy-policy-label">
                  <ZUIText variant="headingMd">
                    <Msg id={messageIds.surveyForm.terms.title} />
                  </ZUIText>
                </FormLabel>
                <SurveyOption
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
              variant="primary"
            />
          </Box>
        </form>
      )}
      {showSuccess && (
        <ZUIAlert
          description={messages.surveyForm.submitted.text({
            title: survey.title,
          })}
          severity="success"
          title={messages.surveyForm.submitted.title()}
        />
      )}
    </>
  );
};

export default ZUISurveyForm;
