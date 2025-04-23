import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  BlockKind,
  BoldNode,
  EmailInsights,
  InlineNodeKind,
  ItalicNode,
  LinkNode,
  ZetkinEmailLink,
  ZetkinEmailRecipient,
  ZetkinEmailStats,
} from '../types';
import { ZetkinEmail } from 'utils/types/zetkin';
import EmailContentTraverser from '../utils/rendering/EmailContentTraverser';

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

  const output: Result = {
    id: emailId,
    links: [],
    opensByDate: [],
  };

  const recipients = await apiClient.get<ZetkinEmailRecipient[]>(
    `/api/orgs/${orgId}/emails/${emailId}/recipients`
  );

  const sortedOpens = recipients
    .filter((recipient) => !!recipient.opened)
    .sort(
      (a, b) =>
        new Date(a.opened || 0).getTime() - new Date(b.opened || 0).getTime()
    );

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

  const stats = await apiClient.get<ZetkinEmailStats>(
    `/api/orgs/${orgId}/emails/${emailId}/stats`
  );

  const links = await apiClient.get<ZetkinEmailLink[]>(
    `/api/orgs/${orgId}/emails/${emailId}/links`
  );

  const email = await apiClient.get<ZetkinEmail>(
    `/api/orgs/${orgId}/emails/${emailId}`
  );

  const linkTextByTag: Record<string, string | undefined> = {};
  const traverser = new EmailContentTraverser(
    JSON.parse(email.content || '{}')
  );
  traverser.traverse({
    handleBlock(block) {
      if (block.kind == BlockKind.BUTTON) {
        linkTextByTag[block.data.tag] = block.data.text;
      }
      return block;
    },
    handleInline(node) {
      if ('content' in node) {
        let text = '';
        let tag = '';

        const findLink = (
          nodeWithContent: BoldNode | ItalicNode | LinkNode
        ) => {
          if (nodeWithContent.kind == InlineNodeKind.LINK) {
            tag = nodeWithContent.tag;
          }

          const childNode = nodeWithContent.content[0];
          if ('content' in childNode) {
            findLink(childNode);
          } else if (childNode.kind == InlineNodeKind.STRING) {
            text = childNode.value;
          }
        };

        findLink(node);
        if (text && tag) {
          linkTextByTag[tag] = text;
        }
      }
      return node;
    },
  });

  links.forEach((link) => {
    output.links.push({
      ...link,
      clicks: stats.num_clicks_by_link[link.id] || 0,
      text: linkTextByTag[link.tag] || '',
    });
  });

  return output;
}
