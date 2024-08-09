import useSurvey from './useSurvey';

export enum SurveyState {
  EXPIRED = 'expired',
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default function useSurveyState(
  orgId: number,
  surveyId: number
): SurveyState {
  const { data } = useSurvey(orgId, surveyId);

  if (!data) {
    return SurveyState.UNKNOWN;
  }

  if (data.published) {
    const publishDate = new Date(data.published);
    const now = new Date();

    if (publishDate > now) {
      return SurveyState.SCHEDULED;
    } else {
      if (data.expires) {
        const expiryDate = new Date(data.expires);

        if (expiryDate < now) {
          return SurveyState.EXPIRED;
        }
      }

      return SurveyState.PUBLISHED;
    }
  } else {
    return SurveyState.DRAFT;
  }
}
