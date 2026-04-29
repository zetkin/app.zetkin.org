import { ZetkinSurvey } from 'utils/types/zetkin';

export default function getSurveyUrl(
  survey: ZetkinSurvey | null,
  orgId: number
) {
  if (survey) {
    const projectId = getSurveyProjectId(survey, orgId);
    return `/organize/${orgId}/projects/${projectId}/surveys/${survey.id}`;
  } else {
    return '';
  }
}

export function getSurveyProjectId(survey: ZetkinSurvey | null, orgId: number) {
  if (survey) {
    if (survey.organization.id !== orgId) {
      return 'shared';
    }
    return survey.campaign?.id ?? 'standalone';
  } else {
    return '';
  }
}
