import { ZetkinSurvey } from 'utils/types/zetkin';

export default function getSurveyUrl(
  survey: ZetkinSurvey | null,
  orgId: number
) {
  if (survey) {
    const campId = getSurveyCampId(survey);
    return `/organize/${orgId}/projects/${campId}/surveys/${survey.id}`;
  } else {
    return '';
  }
}

export function getSurveyCampId(survey: ZetkinSurvey | null) {
  if (survey) {
    return survey.org_access === 'suborgs'
      ? 'inherited'
      : survey.campaign
      ? survey.campaign.id
      : 'standalone';
  } else {
    return '';
  }
}
