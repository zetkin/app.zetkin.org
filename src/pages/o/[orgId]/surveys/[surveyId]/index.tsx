import BackendApiClient from 'core/api/client/BackendApiClient';
import { Container } from '@mui/material';
import { FC } from 'react';
import { IncomingMessage } from 'http';
import { parse } from 'querystring';
import { scaffold } from 'utils/next';
import SurveyElements from 'features/surveys/components/surveyForm/SurveyElements';
import SurveyHeading from 'features/surveys/components/surveyForm/SurveyHeading';
import SurveyPrivacyPolicy from 'features/surveys/components/surveyForm/SurveyPrivacyPolicy';
import SurveySignature from 'features/surveys/components/surveyForm/SurveySignature';
import SurveySubmitButton from 'features/surveys/components/surveyForm/SurveySubmitButton';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
  ZetkinSurveyQuestionResponse,
  ZetkinSurveySignaturePayload,
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
  let status: ZetkinSurveyFormStatus = 'editing';
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
  status: ZetkinSurveyFormStatus;
  survey: ZetkinSurveyExtended;
};

const Page: FC<PageProps> = ({ formData, status, survey }) => {
  return (
    <Container style={{ height: '100vh' }}>
      <SurveyHeading status={status} survey={survey} />
      <form method="post">
        <SurveyElements formData={formData} survey={survey} />
        <SurveySignature formData={formData} survey={survey} />
        <SurveyPrivacyPolicy formData={formData} survey={survey} />
        <SurveySubmitButton />
      </form>
    </Container>
  );
};

export default Page;
