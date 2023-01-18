import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import IApiClient from 'core/api/client/IApiClient';
import { ZetkinView } from 'utils/types/zetkin';
import { ZetkinViewFolder } from 'features/views/components/types';

export type DeleteFolderReport = {
  foldersDeleted: (number | string)[];
  viewsDeleted: (number | string)[];
};

async function deleteFolder(
  apiClient: IApiClient,
  orgId: number,
  folderId: number,
  views: ZetkinView[],
  folders: ZetkinViewFolder[],
  stats: DeleteFolderReport
) {
  // First delete it's child folders recursively
  const childFolders = folders.filter(
    (folder) => folder.parent?.id == folderId
  );
  for await (const childFolder of childFolders) {
    await deleteFolder(apiClient, orgId, childFolder.id, views, folders, stats);
  }

  // Then delete any views in the folder
  const childViews = views.filter((view) => view.folder?.id == folderId);
  for await (const childView of childViews) {
    await apiClient.delete(`/api/orgs/${orgId}/people/views/${childView.id}`);
    stats.viewsDeleted.push(childView.id);
  }

  // Finally delete the folder itself
  await apiClient.delete(`/api/orgs/${orgId}/people/view_folders/${folderId}`);
  stats.foldersDeleted.push(folderId);
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST') {
    res.status(405).end();
    return;
  }

  const { orgId, folderId } = req.query;
  const client = new BackendApiClient(req.headers);
  const folders = await client.get<ZetkinViewFolder[]>(
    `/api/orgs/${orgId}/people/view_folders`
  );
  const views = await client.get<ZetkinView[]>(
    `/api/orgs/${orgId}/people/views`
  );

  const stats: DeleteFolderReport = {
    foldersDeleted: [],
    viewsDeleted: [],
  };

  await deleteFolder(
    client,
    parseInt(orgId as string),
    parseInt(folderId as string),
    views,
    folders,
    stats
  );

  res.status(200).json({ data: stats });
}
