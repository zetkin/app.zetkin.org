import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinPerson } from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
  personIds: z.array(z.number()),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinPerson[];

export const loadPersonFieldsDef = {
  handler: handle,
  name: 'loadPersonFields',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(loadPersonFieldsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { personIds, orgId } = params;

  const detailedPersons: ZetkinPerson[] = [];

  for await (const personId of personIds) {
    const detailedPerson = await apiClient.get<ZetkinPerson>(
      `/api/orgs/${orgId}/people/${personId}`
    );
    detailedPersons.push(detailedPerson);
  }

  return detailedPersons;
}
