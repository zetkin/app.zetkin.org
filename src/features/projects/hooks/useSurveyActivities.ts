import { getUTCDateWithoutTime } from 'utils/dateUtils';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinSurvey } from 'utils/types/zetkin';
import { ACTIVITIES, ProjectActivity } from '../types';
import {
  projectSurveyIdsLoad,
  projectSurveyIdsLoaded,
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

export default function useSurveyActivities(
  orgId: number,
  projectId?: number
): IFuture<ProjectActivity[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const surveysSlice = useAppSelector((state) => state.surveys);

  const activities: ProjectActivity[] = [];

  if (projectId) {
    const surveyIdsByProjectId = surveysSlice.surveyIdsByProjectId[projectId];
    const surveyIdsFuture = loadListIfNecessary(
      surveyIdsByProjectId,
      dispatch,
      {
        actionOnLoad: () => projectSurveyIdsLoad(projectId),
        actionOnSuccess: (data) => projectSurveyIdsLoaded([projectId, data]),
        loader: async () => {
          const surveys = await apiClient.get<ZetkinSurvey[]>(
            `/api/orgs/${orgId}/campaigns/${projectId}/surveys`
          );
          return surveys.map((survey) => ({ id: survey.id }));
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
          `/api/orgs/${orgId}/campaigns/${projectId}/surveys`
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
