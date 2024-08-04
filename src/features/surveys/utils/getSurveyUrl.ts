import { ZetkinSurvey } from 'utils/types/zetkin';

export default function getSurveyUrl(survey: ZetkinSurvey | null) {
  if (survey) {
    return `/organize/${survey.organization.id}/projects/${
      survey.campaign ? `${survey.campaign.id}` : 'standalone'
    }/surveys/${survey.id}`;
  } else {
    return '';
  }
}
