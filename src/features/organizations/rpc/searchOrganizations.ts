import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinOrganization } from 'utils/types/zetkin';

const paramsSchema = z.object({
  query: z.string(),
});

type Params = z.infer<typeof paramsSchema>;
type Result = ZetkinOrganization[];

export const searchOrganizationsDef = {
  handler: handle,
  name: 'searchOrganizations',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(searchOrganizationsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const organizations = await apiClient.get<ZetkinOrganization[]>('/api/orgs');
  const query = params.query.trim().toLowerCase();

  return organizations.filter((organization) =>
    organization.title.toLowerCase().includes(query)
  );
}
