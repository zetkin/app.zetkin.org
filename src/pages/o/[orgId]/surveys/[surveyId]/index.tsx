import BackendApiClient from 'core/api/client/BackendApiClient';
import ErrorMessage from 'features/surveys/components/surveyForm/ErrorMessage';
import { IncomingMessage } from 'http';
import messageIds from 'features/surveys/l10n/messageIds';
import OptionsQuestion from 'features/surveys/components/surveyForm/OptionsQuestion';
import { parse } from 'querystring';
import { scaffold } from 'utils/next';
import TextBlock from 'features/surveys/components/surveyForm/TextBlock';
import TextQuestion from 'features/surveys/components/surveyForm/TextQuestion';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import ZUIAvatar from 'zui/ZUIAvatar';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormControlLabelProps,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useRadioGroup,
} from '@mui/material';
import { FC, useState } from 'react';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyOptionsQuestionElement,
  ZetkinSurveyTextElement,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

function parseRequest(
  req: IncomingMessage
): Promise<NodeJS.Dict<string | string[]>> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(parse(body));
    });
  });
}

export const getServerSideProps = scaffold(async (ctx) => {
  const { req } = ctx;
  const { surveyId, orgId } = ctx.params!;
  let status: FormStatus = 'editing';

  const apiClient = new BackendApiClient(req.headers);
  let survey: ZetkinSurveyExtended;
  try {
    survey = await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );
  } catch (e) {
    return { notFound: true };
  }

  if (req.method === 'POST') {
    const form = await parseRequest(req);
    const responses: Record<
      string,
      {
        options?: number[];
        question_id: number;
        response?: string;
      }
    > = {};

    for (const name in form) {
      const isSignature = name.startsWith('sig');
      const isPrivacy = name.startsWith('privacy');
      const isMetadata = isSignature || isPrivacy;
      if (isMetadata) {
        continue;
      }

      const fields = name.split('.');
      const questionId = fields[0];
      const questionType = fields[1];

      if (typeof responses[questionId] === 'undefined') {
        responses[questionId] = {
          question_id: parseInt(fields[0]),
        };
      }

      if (questionType == 'options') {
        if (Array.isArray(form[name])) {
          responses[questionId].options = (form[name] as string[]).map((o) =>
            parseInt(o)
          );
        } else {
          responses[questionId].options = [parseInt((form[name] as string)!)];
        }
      } else if (questionType == 'text') {
        responses[questionId].response = form[name] as string;
      }
    }

    let signature: null | {
      email: string;
      first_name: string;
      last_name: string;
    } = null;
    // TODO: handle other signature types
    if (form.sig == 'email') {
      signature = {
        email: form['sig.email'] as string,
        first_name: form['sig.first_name'] as string,
        last_name: form['sig.last_name'] as string,
      };
    }

    try {
      await apiClient.post(
        `/api/orgs/${orgId}/surveys/${surveyId}/submissions`,
        {
          responses: Object.values(responses),
          signature,
        }
      );
      status = 'submitted';
    } catch (e) {
      status = 'error';
    }

    if (status === 'submitted') {
      return {
        redirect: {
          destination: `/o/${orgId}/surveys/${surveyId}/submitted`,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      orgId,
      status,
      survey,
    },
  };
}, scaffoldOptions);

type PageProps = {
  orgId: string;
  status: FormStatus;
  survey: ZetkinSurveyExtended;
};

type FormStatus = 'editing' | 'invalid' | 'error' | 'submitted';
type SignatureOption = 'authenticated' | 'email' | 'anonymous';

function RadioFormControlLabel(props: FormControlLabelProps) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  if (checked) {
    return (
      <FormControlLabel
        checked={checked}
        sx={{
          backgroundColor: '#fbcbd8',
          borderRadius: '50px',
        }}
        {...props}
      />
    );
  }

  return <FormControlLabel checked={checked} {...props} />;
}

const Page: FC<PageProps> = ({ orgId, status, survey }) => {
  const messages = useMessages(messageIds);

  const [selectedOption, setSelectedOption] = useState<null | SignatureOption>(
    null
  );

  const handleRadioChange = (value: SignatureOption) => {
    setSelectedOption(value);
  };

  const currentUser = useCurrentUser();

  return (
    <Container style={{ height: '100vh' }}>
      <Box alignItems="center" columnGap={1} display="flex" flexDirection="row">
        <ZUIAvatar size="md" url={`/api/orgs/${orgId}/avatar`} />
        {survey.organization.title}
      </Box>

      {status === 'error' && <ErrorMessage />}

      <h1>{survey.title}</h1>

      {survey.info_text && <p>{survey.info_text}</p>}

      <form method="post">
        {survey.elements.map((element) => (
          <div key={element.id}>
            {element.type === 'question' && (
              <>
                {element.question.response_type === 'text' && (
                  <TextQuestion
                    element={element as ZetkinSurveyTextQuestionElement}
                  />
                )}
                {element.question.response_type === 'options' && (
                  <OptionsQuestion
                    element={element as ZetkinSurveyOptionsQuestionElement}
                  />
                )}
              </>
            )}
            {element.type === 'text' && (
              <TextBlock element={element as ZetkinSurveyTextElement} />
            )}
          </div>
        ))}
        <Typography
          style={{
            color: 'black',
            fontSize: '1.5em',
            fontWeight: '500',
            marginBottom: '0.5em',
            marginTop: '0.5em',
          }}
        >
          <Msg id={messageIds.surveyForm.signOptions} />
        </Typography>

        <RadioGroup
          name="sig"
          onChange={(e) => handleRadioChange(e.target.value as SignatureOption)}
          value={selectedOption}
        >
          <RadioFormControlLabel
            control={<Radio required />}
            label={
              <Typography>
                <Msg
                  id={messageIds.surveyForm.authenticatedOption}
                  values={{
                    email: currentUser?.email ?? '',
                    person: currentUser?.first_name ?? '',
                  }}
                />
              </Typography>
            }
            value="authenticated"
          />

          <RadioFormControlLabel
            control={<Radio required />}
            label={
              <div>
                <Typography>
                  <Msg id={messageIds.surveyForm.nameEmailOption} />
                </Typography>
              </div>
            }
            value="email"
          />

          {selectedOption === 'email' && (
            <Box display="flex" flexDirection="column">
              <TextField label="First Name" name="sig.first_name" required />
              <TextField label="Last Name" name="sig.last_name" required />
              <TextField label="Email" name="sig.email" required />
            </Box>
          )}

          {survey.signature === 'allow_anonymous' && (
            <RadioFormControlLabel
              control={<Radio required />}
              label={
                <Typography>
                  <Msg id={messageIds.surveyForm.anonymousOption} />
                </Typography>
              }
              value="anonymous"
            />
          )}
        </RadioGroup>

        <Box alignItems="center" component="section" sx={{ py: 2 }}>
          <Typography fontWeight={'bold'}>
            <Msg id={messageIds.surveyForm.terms.title} />
          </Typography>

          <FormControlLabel
            control={<Checkbox required />}
            data-testid="Survey-acceptTerms"
            label={<Msg id={messageIds.surveyForm.accept} />}
            name="privacy.approval"
          />
          <Typography style={{ fontSize: '0.8em' }}>
            <Msg
              id={messageIds.surveyForm.terms.description}
              values={{ organization: survey.organization.title }}
            />
          </Typography>
          <Typography style={{ fontSize: '0.8em', marginBottom: '0.5em' }}>
            <Link
              href={messages.surveyForm.policy.link()}
              rel="noreferrer"
              target="_blank"
            >
              <Msg id={messageIds.surveyForm.policy.text} />
            </Link>
          </Typography>
        </Box>

        <Button
          color="primary"
          data-testid="Survey-submit"
          style={{ textAlign: 'center', width: '100%' }}
          type="submit"
          variant="contained"
        >
          {messages.surveyForm.submit()}
        </Button>
      </form>
    </Container>
  );
};

export default Page;
