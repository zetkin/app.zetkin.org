import { createApiFetch } from 'utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';
import { ZetkinView, ZetkinViewFolder } from 'features/views/components/types';

export type ViewTreeData = {
  folders: ZetkinViewFolder[];
  views: ZetkinView[];
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const apiFetch = createApiFetch(req.headers);
  const { orgId } = req.query;

  try {
    const viewsRes = await apiFetch(`/orgs/${orgId}/people/views`);
    const viewsData = await viewsRes.json();
    const views = viewsData.data as ZetkinView[];

    const foldersRes = await apiFetch(`/orgs/${orgId}/people/view_folders`);
    const foldersData = await foldersRes.json();
    const folders = foldersData.data as ZetkinViewFolder[];

    const output: ViewTreeData = {
      folders,
      views,
    };

    res.status(200).json({ data: output });
  } catch (err) {
    res.status(500).end();
  }
}
