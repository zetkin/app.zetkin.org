import createCallAssignmentRpc from 'features/callAssignments/rpc/createCallAssignment';
import {
  callAssignmentCreate,
  callAssignmentCreated,
} from 'features/callAssignments/store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
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
  ) => IFuture<ZetkinCallAssignment>;
  createSurvey: (surveyBody: ZetkinSurveyPostBody) => IFuture<ZetkinSurvey>;
}

export default function useCreateProjectActivity(
  orgId: number,
  projectId: number
): UseCreateProjectActivityReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createCallAssignment = (
    callAssignmentBody: ZetkinCallAssignmentPartial
  ): IFuture<ZetkinCallAssignment> => {
    dispatch(callAssignmentCreate);

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

    return new PromiseFuture(promise);
  };

  const createSurvey = (
    surveyBody: ZetkinSurveyPostBody
  ): IFuture<ZetkinSurvey> => {
    dispatch(surveyCreate);

    const promise = apiClient
      .post<ZetkinSurveyExtended, ZetkinSurveyPostBody>(
        `/api/orgs/${orgId}/campaigns/${projectId}/surveys`,
        surveyBody
      )
      .then((survey) => {
        dispatch(surveyCreated(survey));
        return survey;
      });

    return new PromiseFuture(promise);
  };

  return { createCallAssignment, createSurvey };
}
