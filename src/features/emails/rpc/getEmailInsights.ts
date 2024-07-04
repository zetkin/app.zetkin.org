import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { EmailInsights, ZetkinEmailRecipient } from '../types';

const paramsSchema = z.object({
  emailId: z.number(),
  orgId: z.number(),
});
type Params = z.input<typeof paramsSchema>;
type Result = EmailInsights;

export const getEmailInsightsDef = {
  handler: handle,
  name: 'getEmailInsights',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(getEmailInsightsDef.name);

async function handle(params: Params, apiClient: IApiClient) {
  const { emailId, orgId } = params;

  const recipients = await apiClient.get<ZetkinEmailRecipient[]>(
    `/api/orgs/${orgId}/emails/${emailId}/recipients`
  );

  const sortedOpens = recipients
    .filter((recipient) => !!recipient.opened)
    .sort(
      (a, b) =>
        new Date(a.opened || 0).getTime() - new Date(b.opened || 0).getTime()
    );

  const output: Result = {
    id: emailId,
    opensByDate: [],
  };

  const firstEvent = sortedOpens[0];

  if (firstEvent?.opened) {
    let dateOfLastPoint = new Date(0);
    const minPointDiff = 5 * 60 * 1000; // 5 minutes

    sortedOpens.forEach((recipient, index) => {
      const openDate = new Date(recipient.opened || 0);

      const diff = openDate.getTime() - dateOfLastPoint.getTime();
      const isLast = index == sortedOpens.length - 1;

      if (diff > minPointDiff || isLast) {
        dateOfLastPoint = new Date(openDate);
        output.opensByDate.push({
          accumulatedOpens: index + 1,
          date: openDate.toISOString(),
        });
      }
    });
  }

  return output;
}
