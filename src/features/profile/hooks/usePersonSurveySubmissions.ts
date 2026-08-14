import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  personSurveySubmissionsLoad,
  personSurveySubmissionsLoaded,
} from '../store';
import { ZetkinPerson, ZetkinSurveySubmission } from 'utils/types/zetkin';
import { loadListIfNecessary } from 'core/caching/cacheUtils';

export default function usePersonSurveySubmissions(
  orgId: number,
  person: Pick<ZetkinPerson, 'first_name' | 'last_name' | 'id'>
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const personSurveySubmissions = useAppSelector(
    (state) => state.profiles.surveySubmissionsByPersonId[person.id]
  );

  return loadListIfNecessary(personSurveySubmissions, dispatch, {
    actionOnLoad: () => personSurveySubmissionsLoad(person.id),
    actionOnSuccess: (data) => personSurveySubmissionsLoaded([person.id, data]),
    loader: async () => {
      const allSubmissionsWithSimilarName = await apiClient.post<
        ZetkinSurveySubmission[],
        { q: string }
      >(`/api/orgs/${orgId}/search/surveysubmission`, {
        q: `${person.first_name} ${person.last_name}`,
      });

      return allSubmissionsWithSimilarName.filter(
        (submission) => submission.respondent?.id === person.id
      );
    },
  });
}
