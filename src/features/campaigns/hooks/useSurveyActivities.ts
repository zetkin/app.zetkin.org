import { ACTIVITIES } from './useActivityOverview';
import { CampaignActivity } from './useCampaignActivities';
import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import {
  campaignSurveyIdsLoad,
  campaignSurveyIdsLoaded,
  surveysLoad,
  surveysLoaded,
} from 'features/surveys/store';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinSurvey, ZetkinTask } from 'utils/types/zetkin';

export default function useSurveyActivities(
  orgId: number,
  campId?: number
): IFuture<CampaignActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const surveysSlice = useAppSelector((state) => state.surveys);

  const activities: CampaignActivity[] = [];

  if (campId) {
    const surveyIdsByCampaignId = surveysSlice.surveyIdsByCampaignId[campId];
    const surveyIdsFuture = loadListIfNecessary(
      surveyIdsByCampaignId,
      dispatch,
      {
        actionOnLoad: () => campaignSurveyIdsLoad(campId),
        actionOnSuccess: (data) => campaignSurveyIdsLoaded([campId, data]),
        loader: async () => {
          const tasks = await apiClient.get<ZetkinTask[]>(
            `/api/orgs/${orgId}/campaigns/${campId}/surveys`
          );
          return tasks.map((survey) => ({ id: survey.id }));
        },
      }
    );

    if (surveyIdsFuture.isLoading) {
      return new LoadingFuture();
    } else if (surveyIdsFuture.error) {
      return new ErrorFuture(surveyIdsFuture.error);
    }

    const surveyList = surveysSlice.surveyList;
    const surveysFuture = loadListIfNecessary(surveyList, dispatch, {
      actionOnLoad: () => surveysLoad(),
      actionOnSuccess: (data) => surveysLoaded(data),
      loader: () =>
        apiClient.get<ZetkinSurvey[]>(
          `/api/orgs/${orgId}/campaigns/${campId}/surveys`
        ),
    });

    if (surveysFuture.isLoading) {
      return new LoadingFuture();
    } else if (surveysFuture.error) {
      return new ErrorFuture(surveysFuture.error);
    }

    if (surveyIdsFuture.data && surveysFuture.data) {
      const surveys = surveysFuture.data;
      const surveyIds = surveyIdsFuture.data;

      surveyIds.forEach(({ id: surveyId }) => {
        const survey = surveys.find((item) => item.id === surveyId);

        if (survey) {
          activities.push({
            data: survey,
            kind: ACTIVITIES.SURVEY,
            visibleFrom: getUTCDateWithoutTime(survey.published || null),
            visibleUntil: getUTCDateWithoutTime(survey.expires || null),
          });
        }
      });
    }
  } else {
    const surveyList = surveysSlice.surveyList;
    const allSurveysFuture = loadListIfNecessary(surveyList, dispatch, {
      actionOnLoad: () => surveysLoad(),
      actionOnSuccess: (data) => surveysLoaded(data),
      loader: () => apiClient.get<ZetkinSurvey[]>(`/api/orgs/${orgId}/surveys`),
    });

    if (allSurveysFuture.data) {
      const allSurveys = allSurveysFuture.data;
      allSurveys.forEach((survey) => {
        activities.push({
          data: survey,
          kind: ACTIVITIES.SURVEY,
          visibleFrom: getUTCDateWithoutTime(survey.published || null),
          visibleUntil: getUTCDateWithoutTime(survey.expires || null),
        });
      });
    }
  }

  return new ResolvedFuture(activities);
}
