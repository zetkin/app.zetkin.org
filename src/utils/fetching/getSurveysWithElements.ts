import { defaultFetch } from '.';
import { ZetkinSurvey, ZetkinSurveyExtended } from '../types/zetkin';

export default function getSurveysWithElements(
  orgId: string,
  fetch = defaultFetch
) {
  return async (): Promise<ZetkinSurveyExtended[]> => {
    const res = await fetch(`/orgs/${orgId}/surveys`);
    const body = await res.json();

    const surveys: ZetkinSurvey[] = body.data;

    const surveysWithElements = await Promise.all(
      surveys.map(
        async (s) =>
          await fetch(`/orgs/${orgId}/surveys/${s.id}`).then((res) =>
            res.json()
          )
      )
    );

    return surveysWithElements.map((s) => s.data);
  };
}
