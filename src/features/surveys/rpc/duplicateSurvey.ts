import { z } from 'zod';

import {
  ZetkinSurvey,
  ZetkinSurveyExtended,
  ZetkinSurveyPostBody,
  ZetkinSurveyElement,
  ELEMENT_TYPE,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';
import { makeRPCDef } from 'core/rpc/types';
import IApiClient from 'core/api/client/IApiClient';
import { ZetkinSurveyElementPostBody } from '../hooks/useSurveyMutations';

const paramsSchema = z.object({
  campId: z.number(),
  orgId: z.number(),
  surveyId: z.number(),
});

type Params = z.input<typeof paramsSchema>;

export const duplicateSurveyDef = {
  handler: handle,
  name: 'duplicateSurvey',
  schema: paramsSchema,
};

export default makeRPCDef<Params, ZetkinSurveyExtended>(
  duplicateSurveyDef.name
);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<ZetkinSurveyExtended> {
  const { orgId, surveyId, campId } = params;

  if (orgId === undefined || surveyId === undefined) {
    throw new Error('orgId and surveyId must be defined');
  }

  const survey = await apiClient.get<ZetkinSurveyExtended>(
    `/api/orgs/${orgId}/surveys/${surveyId}`
  );

  const createElementPostBody = (
    element: ZetkinSurveyElement
  ): ZetkinSurveyElementPostBody | null => {
    if (element.type === ELEMENT_TYPE.TEXT) {
      return {
        hidden: element.hidden,
        text_block: element.text_block,
        type: element.type,
      };
    }

    if (element.type === ELEMENT_TYPE.QUESTION) {
      if ('options' in element.question) {
        return {
          hidden: element.hidden,
          question: {
            description: element.question.description,
            options: element.question.options?.map((option) => option.text),
            question: element.question.question,
            response_config: element.question.response_config,
            response_type: element.question.response_type,
          },
          type: element.type,
        };
      }
      element = element as ZetkinSurveyTextQuestionElement;
      return {
        hidden: element.hidden,
        question: {
          description: element.question.description,
          question: element.question.question,
          response_config: element.question.response_config,
          response_type: element.question.response_type,
        },
        type: element.type,
      };
    }
    return null;
  };

  const body: ZetkinSurveyPostBody = {
    access: survey?.access,
    callers_only: survey?.callers_only,
    expires: survey?.expires,
    info_text: survey?.info_text,
    org_access: survey?.org_access,
    published: survey?.published,
    signature: survey?.signature,
    title: survey?.title || '',
  };

  const newSurvey = await apiClient.post<ZetkinSurvey, ZetkinSurveyPostBody>(
    `/api/orgs/${orgId}/campaigns/${campId}/surveys`,
    body
  );

  for (const element of survey.elements) {
    const postBody = createElementPostBody(element);
    if (postBody) {
      await apiClient.post<ZetkinSurveyElement, ZetkinSurveyElementPostBody>(
        `/api/orgs/${orgId}/surveys/${newSurvey.id}/elements`,
        postBody
      );
    }
  }

  return newSurvey as ZetkinSurveyExtended;
}
