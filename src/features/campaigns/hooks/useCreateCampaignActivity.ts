import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch } from 'core/hooks';
import createCallAssignmentRpc from 'features/callAssignments/rpc/createCallAssignment';
import {
  callAssignmentCreate,
  callAssignmentCreated,
} from 'features/callAssignments/store';
import { petitionCreate, petitionCreated } from 'features/petition/store';
import {
  ZetkinPetition,
  ZetkinPetitionPostBody,
} from 'features/petition/utils/types';
import { surveyCreate, surveyCreated } from 'features/surveys/store';
import {
  ZetkinCallAssignment,
  ZetkinCallAssignmentPartial,
  ZetkinSurvey,
  ZetkinSurveyExtended,
  ZetkinSurveyPostBody,
} from 'utils/types/zetkin';

interface UseCreateCampaignActivityReturn {
  createCallAssignment: (
    callAssignmentBody: ZetkinCallAssignmentPartial
  ) => IFuture<ZetkinCallAssignment>;
  createSurvey: (surveyBody: ZetkinSurveyPostBody) => IFuture<ZetkinSurvey>;
  createPetition: (
    petitionBody: ZetkinPetitionPostBody
  ) => IFuture<ZetkinPetition>;
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
      .rpc(createCallAssignmentRpc, {
        callAssignment: callAssignmentBody,
        campId,
        orgId,
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
        const d = surveyCreated(survey);

        console.log('survey data ', d);

        dispatch(d);
        return survey;
      });

    return new PromiseFuture(promise);
  };

  const createPetition = (
    petitionBody: ZetkinPetitionPostBody
  ): IFuture<ZetkinPetition> => {
    dispatch(petitionCreate());

    console.log('BODY ', petitionBody);

    const promise = apiClient
      .post<ZetkinPetition, ZetkinPetitionPostBody>(
        `/beta/orgs/${orgId}/petitions
        `,
        petitionBody
      )
      .then((petition) => {
        const data = petitionCreated(petition);

        console.log('data ', data);
        dispatch(data);
        return petition;
      });

    return new PromiseFuture(promise);
  };

  return { createCallAssignment, createSurvey, createPetition };
}
