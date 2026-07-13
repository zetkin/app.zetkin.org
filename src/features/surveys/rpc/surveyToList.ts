import { z } from 'zod';

import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinQuery,
  ZetkinSurveyExtended,
  ZetkinView,
  ZetkinViewColumn,
} from 'utils/types/zetkin';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';
import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
} from 'features/views/components/types';
import { makeRPCDef } from 'core/rpc/types';
import IApiClient from 'core/api/client/IApiClient';

const paramsSchema = z.object({
  firstNameColumnName: z.string(),
  folderId: z.optional(z.number()),
  lastNameColumName: z.string(),
  orgId: z.number(),
  surveyId: z.number(),
  title: z.string(),
});

type Params = z.input<typeof paramsSchema>;

export const surveyToListDef = {
  handler: handle,
  name: 'surveyToList',
  schema: paramsSchema,
};

export default makeRPCDef<Params, ZetkinView>(surveyToListDef.name);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<ZetkinView> {
  const {
    orgId,
    surveyId,
    folderId,
    firstNameColumnName,
    lastNameColumName,
    title,
  } = params;

  if (orgId === undefined || surveyId === undefined) {
    throw new Error('orgId and surveyId must be defined');
  }

  const survey = await apiClient.get<ZetkinSurveyExtended>(
    `/api/orgs/${orgId}/surveys/${surveyId}`
  );

  const view = await apiClient.post<
    ZetkinView,
    ZetkinView & { folder_id?: number }
  >(`/api/orgs/${orgId}/people/views`, {
    folder_id: folderId || undefined,
    title: title,
  });

  await apiClient.patch<ZetkinQuery, Partial<ZetkinQuery>>(
    `/api/orgs/${orgId}/people/views/${view.id}/content_query`,
    {
      filter_spec: [
        {
          config: {
            operator: 'submitted',
            survey: surveyId,
          },
          op: OPERATION.ADD,
          type: FILTER_TYPE.SURVEY_SUBMISSION,
        },
      ],
    }
  );

  await apiClient.post<unknown, ZetkinViewColumn>(
    `/api/orgs/${orgId}/people/views/${view.id}/columns`,
    {
      config: {
        field: NATIVE_PERSON_FIELDS.FIRST_NAME,
      },
      title: firstNameColumnName,
      type: COLUMN_TYPE.PERSON_FIELD,
    }
  );

  await apiClient.post<unknown, ZetkinViewColumn>(
    `/api/orgs/${orgId}/people/views/${view.id}/columns`,
    {
      config: {
        field: NATIVE_PERSON_FIELDS.LAST_NAME,
      },
      title: lastNameColumName,
      type: COLUMN_TYPE.PERSON_FIELD,
    }
  );

  for (const elem of survey.elements) {
    if (elem.type === ELEMENT_TYPE.TEXT) {
      continue;
    }

    await apiClient.post<unknown, ZetkinViewColumn>(
      `/api/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          question_id: elem.id,
        },
        title: elem.question.question,
        type:
          elem.question.response_type === RESPONSE_TYPE.OPTIONS
            ? COLUMN_TYPE.SURVEY_OPTIONS
            : COLUMN_TYPE.SURVEY_RESPONSE,
      }
    );
  }

  return view;
}
