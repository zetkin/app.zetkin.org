import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinUser } from 'utils/types/zetkin';

const paramsSchema = z.object({
  query: z.string().trim().min(1),
});

type Params = z.infer<typeof paramsSchema>;
type Result = ZetkinUser[];

export const searchUsersDef = {
  handler: handle,
  name: 'searchUsers',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(searchUsersDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  return apiClient.post<Result, { q: string }>('/api/search/user', {
    q: params.query,
  });
}
