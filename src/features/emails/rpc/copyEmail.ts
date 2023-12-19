import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinEmail } from 'utils/types/zetkin';

const paramsSchema = z.object({
  emailId: z.number(),
  orgId: z.number(),
});
type Params = z.input<typeof paramsSchema>;
type Result = ZetkinEmail;

export const copyEmailDef = {
  handler: handle,
  name: 'copyEmail',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(copyEmailDef.name);

async function handle(params: Params, apiClient: IApiClient) {
  const { emailId, orgId } = params;

  const email = await apiClient.get(`/api/orgs/${orgId}/emails/${emailId}`);
  console.log(email, ' anjei');
  // const updatedEvent = await apiClient.post<ZetkinEvent>(
  //   `/api/orgs/${orgId}/${
  //     campaign_id ? `campaigns/${campaign_id}/` : ''
  //   }actions`,
  //   data
  // );
  return 1;
}
