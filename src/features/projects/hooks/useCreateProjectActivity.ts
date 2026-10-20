import createCallAssignmentRpc from 'features/callAssignments/rpc/createCallAssignment';
import {
  callAssignmentCreate,
  callAssignmentCreated,
} from 'features/callAssignments/store';
import { surveyCreate, surveyCreated } from 'features/surveys/store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinCallAssignmentPartial,
  ZetkinSurveyExtended,
  ZetkinSurveyPostBody,
} from 'utils/types/zetkin';

interface UseCreateProjectActivityReturn {
  createCallAssignment: (
    callAssignmentBody: ZetkinCallAssignmentPartial
  ) => Promise<void>;
  createSurvey: (surveyBody: ZetkinSurveyPostBody) => Promise<void>;
}

export default function useCreateProjectActivity(
  orgId: number,
  projectId: number
): UseCreateProjectActivityReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createCallAssignment = async (
    callAssignmentBody: ZetkinCallAssignmentPartial
  ) => {
    dispatch(callAssignmentCreate());
    const callAssignment = await apiClient.rpc(createCallAssignmentRpc, {
      callAssignment: callAssignmentBody,
      orgId,
      projectId,
    });

    dispatch(callAssignmentCreated([callAssignment, projectId]));
  };

  const createSurvey = async (surveyBody: ZetkinSurveyPostBody) => {
    dispatch(surveyCreate());

    const survey = await apiClient.post<
      ZetkinSurveyExtended,
      ZetkinSurveyPostBody
    >(`/api/orgs/${orgId}/campaigns/${projectId}/surveys`, surveyBody);
    dispatch(surveyCreated(survey));
  };

  return { createCallAssignment, createSurvey };
}
