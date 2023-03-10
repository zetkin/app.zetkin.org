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

export const addBulkOptionsDef = {
  handler: handle,
  name: 'addBulkOptions',
  schema: paramsSchema,
};

export default makeRPCDef<Params, ZetkinSurveyOption[]>(addBulkOptionsDef.name);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<ZetkinSurveyOption[]> {
  const { orgId, surveyId, elemId, options } = params;

  const output: ZetkinSurveyOption[] = [];

  for (const optionText of options) {
    const option = await apiClient.post<ZetkinSurveyOption>(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options`,
      { text: optionText }
    );

    output.push(option);
  }

  return output;
}
