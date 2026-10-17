import createCallAssignmentRpc from 'features/callAssignments/rpc/createCallAssignment';
import {
  callAssignmentCreate,
  callAssignmentCreated,
} from 'features/callAssignments/store';
import { surveyCreate, surveyCreated } from 'features/surveys/store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinCallAssignment,
  ZetkinCallAssignmentPartial,
  ZetkinSurvey,
  ZetkinSurveyExtended,
  ZetkinSurveyPostBody,
} from 'utils/types/zetkin';

interface UseCreateProjectActivityReturn {
  createCallAssignment: (
    callAssignmentBody: ZetkinCallAssignmentPartial
  ) => Promise<ZetkinCallAssignment>;
  createSurvey: (surveyBody: ZetkinSurveyPostBody) => Promise<ZetkinSurvey>;
}

export default function useCreateProjectActivity(
  orgId: number,
  projectId: number
): UseCreateProjectActivityReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createCallAssignment = (
    callAssignmentBody: ZetkinCallAssignmentPartial
  ): Promise<ZetkinCallAssignment> => {
    dispatch(callAssignmentCreate());

    const promise = apiClient
      .rpc(createCallAssignmentRpc, {
        callAssignment: callAssignmentBody,
        orgId,
        projectId,
      })
      .then((callAssignment) => {
        dispatch(callAssignmentCreated([callAssignment, projectId]));
        return callAssignment;
      });

    return promise;
  };

  const createSurvey = (
    surveyBody: ZetkinSurveyPostBody
  ): Promise<ZetkinSurvey> => {
    dispatch(surveyCreate());

    const promise = apiClient
      .post<
        ZetkinSurveyExtended,
        ZetkinSurveyPostBody
      >(`/api/orgs/${orgId}/campaigns/${projectId}/surveys`, surveyBody)
      .then((survey) => {
        dispatch(surveyCreated(survey));
        return survey;
      });

    return promise;
  };

  return { createCallAssignment, createSurvey };
}
