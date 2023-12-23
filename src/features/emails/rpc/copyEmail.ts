import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinEmail,
  ZetkinEmailPostBody,
  ZetkinQuery,
} from 'utils/types/zetkin';

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

  const email = await apiClient.get<ZetkinEmail>(
    `/api/orgs/${orgId}/emails/${emailId}`
  );

  const createdEmail = await apiClient.post<ZetkinEmail, ZetkinEmailPostBody>(
    `/api/orgs/${orgId}/emails`,
    {
      campaign_id: email.campaign.id,
      content: email.content,
      subject: email.subject,
      title: email.title,
    }
  );
  const copiedEmail = await apiClient.patch<ZetkinQuery, Partial<ZetkinQuery>>(
    `/api/orgs/${orgId}/people/queries/${createdEmail.target.id}`,
    { filter_spec: email.target.filter_spec }
  );

  return {
    ...createdEmail,
    target: {
      ...copiedEmail,
      filter_spec: email.target.filter_spec,
    },
  };
}
