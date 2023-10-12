import useViewTree from './useViewTree';
import { ViewTreeData } from 'pages/api/views/tree';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';

export default function useItemSummary(
  orgId: number,
  folderId: number | null
): IFuture<{ folders: number; views: number }> {
  const itemsFuture = useViewTree(orgId);

  const getItemSummary = (itemsFuture: IFuture<ViewTreeData>) => {
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    return new ResolvedFuture({
      folders: itemsFuture.data.folders.filter(
        (folder) => folder.parent?.id == folderId
      ).length,
      views: itemsFuture.data.views.filter((view) => {
        if (view) {
          return view.folder?.id == folderId;
        }
      }).length,
    });
  };

  const itemSummaryFuture = getItemSummary(itemsFuture);

  return itemSummaryFuture;
}
