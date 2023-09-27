import { IFuture, FutureBase, ResolvedFuture } from 'core/caching/futures';
import { ViewTreeData } from 'pages/api/views/tree';
import useViewTree from './useViewTree';

interface UseItemSummaryReturn {
  itemSummaryFuture: IFuture<{ folders: number; views: number }>;
}

export default function useItemSummary(
  orgId: number,
  folderId?: number | null
): UseItemSummaryReturn {
  const itemsFuture = useViewTree(orgId);

  const getItemSummary = (itemsFuture: IFuture<ViewTreeData>) => {
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    return new ResolvedFuture({
      folders: itemsFuture.data.folders.filter(
        (folder) => folder.parent?.id == folderId
      ).length,
      views: itemsFuture.data.views.filter(
        (view) => view.folder?.id == folderId
      ).length,
    });
  };

  const itemSummaryFuture = getItemSummary(itemsFuture);

  return { itemSummaryFuture };
}
