import BackendApiClient from 'core/api/client/BackendApiClient';
import ErrorMessage from 'features/surveys/components/surveyForm/ErrorMessage';
import { FC } from 'react';
import { IncomingMessage } from 'http';
import messageIds from 'features/surveys/l10n/messageIds';
import OptionsQuestion from 'features/surveys/components/surveyForm/OptionsQuestion';
import { parse } from 'querystring';
import { scaffold } from 'utils/next';
import SurveySignature from 'features/surveys/components/surveyForm/SurveySignature';
import TextBlock from 'features/surveys/components/surveyForm/TextBlock';
import TextQuestion from 'features/surveys/components/surveyForm/TextQuestion';
import ZUIAvatar from 'zui/ZUIAvatar';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  Typography,
} from '@mui/material';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyOptionsQuestionElement,
  ZetkinSurveyQuestionResponse,
  ZetkinSurveySignaturePayload,
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
  let formData: NodeJS.Dict<string | string[]> = {};

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
    formData = await parseRequest(req);
    const responses: Record<string, ZetkinSurveyQuestionResponse> = {};

    for (const name in formData) {
      const isSignature = name.startsWith('sig');
      const isPrivacy = name.startsWith('privacy');
      const isMetadata = isSignature || isPrivacy;
      if (isMetadata) {
        continue;
      }

      const fields = name.split('.');
      const questionId = fields[0];
      const questionType = fields[1];

      const value = formData[name];
      if (questionType == 'options') {
        if (Array.isArray(value)) {
          responses[questionId] = {
            options: value.map((o) => parseInt(o)),
            question_id: parseInt(fields[0]),
          };
        } else {
          responses[questionId] = {
            options: [parseInt((formData[name] as string)!)],
            question_id: parseInt(fields[0]),
          };
        }
      } else if (questionType == 'text') {
        responses[questionId] = {
          question_id: parseInt(fields[0]),
          response: formData[name] as string,
        };
      }
    }

    let signature: ZetkinSurveySignaturePayload = null;

    if (formData.sig === 'user') {
      const session = await ctx.z.resource('session').get();
      if (session) {
        signature = 'user';
      }
    }

    if (formData.sig == 'email') {
      signature = {
        email: formData['sig.email'] as string,
        first_name: formData['sig.first_name'] as string,
        last_name: formData['sig.last_name'] as string,
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
      formData,
      orgId,
      status,
      survey,
    },
  };
}, scaffoldOptions);

type PageProps = {
  formData: NodeJS.Dict<string | string[]>;
  orgId: string;
  status: FormStatus;
  survey: ZetkinSurveyExtended;
};

type FormStatus = 'editing' | 'invalid' | 'error' | 'submitted';

const Page: FC<PageProps> = ({ formData, orgId, status, survey }) => {
  const messages = useMessages(messageIds);

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
                    defaultValue={
                      typeof formData[`${element.id}.text`] === 'string'
                        ? (formData[`${element.id}.text`] as string)
                        : undefined
                    }
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

        <SurveySignature formData={formData} survey={survey} />

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
