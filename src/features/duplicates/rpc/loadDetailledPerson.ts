import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinPerson } from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
  personIds: z.array(z.number()),
});

type Params = z.input<typeof paramsSchema>;
type Result = {
  detailledPersons: ZetkinPerson[];
};

export const loadDetailledPerson = {
  handler: handle,
  name: 'loadPersonFields',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(loadDetailledPerson.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { personIds, orgId } = params;

  const detailledPersons: ZetkinPerson[] = [];

  for await (const personId of personIds) {
    const detailledPerson = await apiClient.get<ZetkinPerson>(
      `/api/orgs/${orgId}/people/${personId}`
    );
    detailledPersons.push(detailledPerson);
  }

  return { detailledPersons };
}
