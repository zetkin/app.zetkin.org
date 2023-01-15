import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { ZetkinView, ZetkinViewFolder } from 'features/views/components/types';

export type ViewTreeData = {
  folders: ZetkinViewFolder[];
  views: ZetkinView[];
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { orgId } = req.query;

  const client = new BackendApiClient(req.headers);

  try {
    const views = await client.get<ZetkinView[]>(
      `/api/orgs/${orgId}/people/views`
    );
    const folders = await client.get<ZetkinViewFolder[]>(
      `/api/orgs/${orgId}/people/view_folders`
    );

    const output: ViewTreeData = {
      folders,
      views,
    };

    res.status(200).json({ data: output });
  } catch (err) {
    res.status(500).end();
  }
}
