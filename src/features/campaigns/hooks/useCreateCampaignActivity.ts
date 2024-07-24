import fixNewCallAssignmentFilterConfigRpc from 'features/callAssignments/rpc/fixNewCallAssignmentFilterConfig';
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
  ZetkinCallAssignmentPostBody,
  ZetkinSurvey,
  ZetkinSurveyExtended,
  ZetkinSurveyPostBody,
} from 'utils/types/zetkin';
import IApiClient from 'core/api/client/IApiClient';

interface UseCreateCampaignActivityReturn {
  createCallAssignment: (
    callAssignmentBody: ZetkinCallAssignmentPartial
  ) => IFuture<ZetkinCallAssignment>;
  createSurvey: (surveyBody: ZetkinSurveyPostBody) => IFuture<ZetkinSurvey>;
}

async function fixNewCallAssignmentFilterConfig(
  apiClient: IApiClient,
  callAssignment: ZetkinCallAssignment
): Promise<ZetkinCallAssignment> {
  await apiClient.rpc(fixNewCallAssignmentFilterConfigRpc, {
    callAssignmentId: callAssignment.id,
    orgId: callAssignment.organization.id,
    queryId: callAssignment.target.id,
  });
  return callAssignment;
}

export default function useCreateCampaignActivity(
  orgId: number,
  campId: number
): UseCreateCampaignActivityReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createCallAssignment = (
    callAssignmentBody: ZetkinCallAssignmentPartial
  ): IFuture<ZetkinCallAssignment> => {
    dispatch(callAssignmentCreate);

    const promise = apiClient
      .post<ZetkinCallAssignment, ZetkinCallAssignmentPostBody>(
        `/api/orgs/${orgId}/campaigns/${campId}/call_assignments`,
        //goal_filters and target_filters are required by server when
        //making a POST to create call_assignment, so adding them here.
        { ...callAssignmentBody, goal_filters: [], target_filters: [] }
      )
      .then((callAssignment) => {
        return fixNewCallAssignmentFilterConfig(apiClient, callAssignment);
      })
      .then((callAssignment) => {
        dispatch(callAssignmentCreated([callAssignment, campId]));
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
        `/api/orgs/${orgId}/campaigns/${campId}/surveys`,
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
