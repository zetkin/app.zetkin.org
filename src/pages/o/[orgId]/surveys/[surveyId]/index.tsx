import BackendApiClient from 'core/api/client/BackendApiClient';
import { Container } from '@mui/material';
import { FC } from 'react';
import { IncomingMessage } from 'http';
import { parse } from 'querystring';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { scaffold } from 'utils/next';
import SurveyElements from 'features/surveys/components/surveyForm/SurveyElements';
import SurveyHeading from 'features/surveys/components/surveyForm/SurveyHeading';
import SurveyPrivacyPolicy from 'features/surveys/components/surveyForm/SurveyPrivacyPolicy';
import SurveySignature from 'features/surveys/components/surveyForm/SurveySignature';
import SurveySubmitButton from 'features/surveys/components/surveyForm/SurveySubmitButton';
import {
  ZetkinSurveyExtended,
  ZetkinSurveyFormStatus,
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
    const session = await ctx.z.resource('session').get();
    const submission = prepareSurveyApiSubmission(formData, !!session);

    try {
      await apiClient.post(
        `/api/orgs/${orgId}/surveys/${surveyId}/submissions`,
        submission
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
