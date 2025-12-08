import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { ZetkinSurvey } from 'utils/types/zetkin';
import { ACTIVITIES, CampaignActivity } from '../types';
import {
  campaignSurveyIdsLoad,
  campaignSurveyIdsLoaded,
  surveysLoad,
  surveysLoaded,
} from 'features/surveys/store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useSurveyActivities(
  orgId: number,
  campId?: number
): CampaignActivity[] {
  const apiClient = useApiClient();
  const surveysSlice = useAppSelector((state) => state.surveys);

  // Call all hooks unconditionally, use isNecessary to control loading
  const surveyIdsByCampaignId = campId
    ? surveysSlice.surveyIdsByCampaignId[campId]
    : undefined;
  const surveyIds = useRemoteList(surveyIdsByCampaignId, {
    actionOnLoad: () => campaignSurveyIdsLoad(campId || 0),
    actionOnSuccess: (data) => campaignSurveyIdsLoaded([campId || 0, data]),
    cacheKey: `survey-ids-campaign-${orgId}-${campId}`,
    isNecessary: () => !!campId,
    loader: () =>
      apiClient
        .get<ZetkinSurvey[]>(`/api/orgs/${orgId}/campaigns/${campId}/surveys`)
        .then((surveys) => surveys.map((survey) => ({ id: survey.id }))),
  });

  const surveyList = surveysSlice.surveyList;
  const campaignSurveys = useRemoteList<ZetkinSurvey>(surveyList, {
    actionOnLoad: () => surveysLoad(),
    actionOnSuccess: (data) => surveysLoaded(data),
    cacheKey: `surveys-campaign-${orgId}-${campId}`,
    isNecessary: () => !!campId,
    loader: () =>
      apiClient.get<ZetkinSurvey[]>(
        `/api/orgs/${orgId}/campaigns/${campId}/surveys`
      ),
  });

  const allSurveys = useRemoteList<ZetkinSurvey>(surveyList, {
    actionOnLoad: () => surveysLoad(),
    actionOnSuccess: (data) => surveysLoaded(data),
    cacheKey: `surveys-org-${orgId}`,
    isNecessary: () => !campId,
    loader: () => apiClient.get<ZetkinSurvey[]>(`/api/orgs/${orgId}/surveys`),
  });

  const activities: CampaignActivity[] = [];

  if (campId) {
    surveyIds.forEach(({ id: surveyId }) => {
      const survey = campaignSurveys.find((item) => item.id === surveyId);

      if (survey) {
        activities.push({
          data: survey,
          kind: ACTIVITIES.SURVEY,
          visibleFrom: getUTCDateWithoutTime(survey.published || null),
          visibleUntil: getUTCDateWithoutTime(survey.expires || null),
        });
      }
    });
  } else {
    allSurveys.forEach((survey) => {
      activities.push({
        data: survey,
        kind: ACTIVITIES.SURVEY,
        visibleFrom: getUTCDateWithoutTime(survey.published || null),
        visibleUntil: getUTCDateWithoutTime(survey.expires || null),
      });
    });
  }

  return activities;
}
