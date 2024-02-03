import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinSurveyOption } from 'utils/types/zetkin';

const paramsSchema = z.object({
  elemId: z.number(),
  options: z.array(z.string()),
  orgId: z.number(),
  surveyId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = {
  addedOptions: ZetkinSurveyOption[];
  removedOptions: ZetkinSurveyOption[];
};

export const addBulkOptionsDef = {
  handler: handle,
  name: 'addBulkOptions',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(addBulkOptionsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId, surveyId, elemId, options } = params;

  const addedOptions: ZetkinSurveyOption[] = [];

  const existingOptions = await apiClient.get<ZetkinSurveyOption[]>(
    `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options`
  );

  for (const optionText of options) {
    const option = await apiClient.post<ZetkinSurveyOption>(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options`,
      { text: optionText }
    );

    addedOptions.push(option);
  }

  // Delete all empty options
  const removedOptions: ZetkinSurveyOption[] = [];
  for (const oldOption of existingOptions) {
    if (oldOption.text.trim() == '') {
      await apiClient.delete(
        `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options/${oldOption.id}`
      );
      removedOptions.push(oldOption);
    }
  }

  return {
    addedOptions,
    removedOptions,
  };
}
