import { createApiFetch } from 'utils/apiFetch';
import { NextApiRequest, NextApiResponse } from 'next';
import { ZetkinView, ZetkinViewFolder } from 'features/views/components/types';

export interface ViewTreeFolder {
  id: number | string;
  type: 'folder';
  title: string;
  owner: string;
  data: ZetkinViewFolder;
  folderId: number | null;
}

export interface ViewTreeView {
  id: number | string;
  type: 'view';
  title: string;
  owner: string;
  data: ZetkinView;
  folderId: number | null;
}

export type ViewTreeItem = ViewTreeFolder | ViewTreeView;

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

    const outputFolders = folders.map<ViewTreeFolder>((folder) => ({
      data: folder,
      folderId: folder.parent ? folder.parent.id : null,
      id: 'folders/' + folder.id,
      owner: '',
      title: folder.title,
      type: 'folder',
    }));

    const outputViews = views.map<ViewTreeView>((view) => ({
      data: view,
      folderId: view.folder ? view.folder.id : null,
      id: 'views/' + view.id,
      owner: view.owner.name,
      title: view.title,
      type: 'view',
    }));

    const output: ViewTreeItem[] = [...outputFolders, ...outputViews];

    res.status(200).json({
      data: output,
    });
  } catch (err) {
    res.status(500).end();
  }
}
