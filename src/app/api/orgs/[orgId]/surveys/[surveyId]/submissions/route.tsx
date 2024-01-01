import BackendApiClient from 'core/api/client/BackendApiClient';
import prepareSurveyApiSubmission from 'features/surveys/utils/prepareSurveyApiSubmission';
import { ZetkinSurveyExtended } from 'utils/types/zetkin';

type Params = {
  orgId: string;
  surveyId: string;
};

export async function POST(request: Request, { params }: { params: Params }) {
  const apiClient = new BackendApiClient(
    Object.fromEntries(request.headers.entries())
  );

  try {
    await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${params.orgId}/surveys/${params.surveyId}`
    );
  } catch (e) {
    return { notFound: true };
  }

  const formData = await request.json();
  const submission = prepareSurveyApiSubmission(formData, false);

  await apiClient.post(
    `/api/orgs/${params.orgId}/surveys/${params.surveyId}/submissions`,
    submission
  );

  return new Response(null, { status: 201 });
}
