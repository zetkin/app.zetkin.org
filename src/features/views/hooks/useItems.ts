import useViewTree from './useViewTree';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

export interface ViewBrowserFolderItem {
  id: number | string;
  type: 'folder';
  title: string;
  owner: string;
  data: ZetkinViewFolder;
  folderId: number | null;
}

export interface ViewBrowserViewItem {
  id: number | string;
  type: 'view';
  title: string;
  owner: string;
  data: ZetkinView;
  folderId: number | null;
}

type ViewBrowserBackItem = {
  folderId: number | null;
  id: string;
  title: string | null;
  type: 'back';
};

export type ViewBrowserItem =
  | ViewBrowserFolderItem
  | ViewBrowserViewItem
  | ViewBrowserBackItem;

export default function useItems(
  orgId: number,
  folderId: number | null
): IFuture<ViewBrowserItem[]> {
  const itemsFuture = useViewTree(orgId);

  if (!itemsFuture.data) {
    return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
  }

  const items: ViewBrowserItem[] = [];

  if (folderId) {
    const folder = itemsFuture.data.folders.find(
      (folder) => folder.id == folderId
    );
    if (folder) {
      items.push({
        folderId: folder.parent?.id ?? null,
        id: 'back',
        title: folder.parent?.title ?? null,
        type: 'back',
      });
    }
  }

  itemsFuture.data.folders
    .filter((folder) => folder.parent?.id == folderId)
    .forEach((folder) => {
      items.push({
        data: folder,
        folderId: folderId,
        id: 'folders/' + folder.id,
        owner: '',
        title: folder.title,
        type: 'folder',
      });
    });

  itemsFuture.data.views
    .filter((view) => {
      if (view) {
        return view.folder?.id == folderId;
      }
    })
    .forEach((view) => {
      items.push({
        data: view,
        folderId: folderId,
        id: 'lists/' + view.id,
        owner: view.owner.name,
        title: view.title,
        type: 'view',
      });
    });

  return new ResolvedFuture(items);
}
