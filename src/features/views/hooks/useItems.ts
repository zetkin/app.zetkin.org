import useViewTree from './useViewTree';
import { ViewBrowserItem } from '../models/ViewBrowserModel';
import { ViewTreeData } from 'pages/api/views/tree';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';

interface UseItemsReturn {
  itemsFuture: IFuture<ViewBrowserItem[]>;
}

export default function useItems(
  orgId: number,
  folderId: number | null
): UseItemsReturn {
  const viewTreeFuture = useViewTree(orgId);

  const getItems = (itemsFuture: IFuture<ViewTreeData>) => {
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
      .filter((view) => view.folder?.id == folderId)
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
  };
  const itemsFuture = getItems(viewTreeFuture);
  return { itemsFuture };
}
