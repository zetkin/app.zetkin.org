import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinEmail,
  ZetkinEmailPostBody,
  ZetkinEvent,
  ZetkinQuery,
  ZetkinSmartSearchFilter,
} from 'utils/types/zetkin';
import { FILTER_TYPE, OPERATION } from 'features/smartSearch/components/types';

const paramsSchema = z.object({
  emailTitle: z.string(),
  eventId: z.number(),
  orgId: z.number(),
});
type Params = z.input<typeof paramsSchema>;
type Result = ZetkinEmail;

type ZetkinEmailPatchBody = Partial<Omit<ZetkinEmail, 'locked'>> & {
  campaign_id?: number;
  locked?: boolean;
};

export const createEmailFromEventParticipantsDef = {
  handler: handle,
  name: 'createEmailFromEventParticipants',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(
  createEmailFromEventParticipantsDef.name
);

async function handle(params: Params, apiClient: IApiClient) {
  const { emailTitle, eventId, orgId } = params;

  const event = await apiClient.get<ZetkinEvent>(
    `/api/orgs/${orgId}/actions/${eventId}`
  );

  const createdEmail = await apiClient.post<ZetkinEmail, ZetkinEmailPostBody>(
    `/api/orgs/${orgId}/emails`,
    {
      campaign_id: event.campaign?.id || null,
      subject: emailTitle,
      title: emailTitle,
    }
  );

  const filterSpec: ZetkinSmartSearchFilter[] = [
    {
      config: {
        action: eventId,
        state: 'signed_up',
      },
      op: OPERATION.ADD,
      type: FILTER_TYPE.EVENT_PARTICIPATION,
    },
    {
      config: {
        action: eventId,
        state: 'booked',
      },
      op: OPERATION.ADD,
      type: FILTER_TYPE.EVENT_PARTICIPATION,
    },
  ];

  const targetQuery = await apiClient.patch<ZetkinQuery, Partial<ZetkinQuery>>(
    `/api/orgs/${orgId}/people/queries/${createdEmail.target.id}`,
    {
      filter_spec: filterSpec,
    }
  );

  await apiClient.patch<ZetkinEmail, ZetkinEmailPatchBody>(
    `/api/orgs/${orgId}/emails/${createdEmail.id}`,
    {
      locked: true,
    }
  );

  return {
    ...createdEmail,
    target: {
      ...targetQuery,
      filter_spec: filterSpec,
    },
  };
}
