import useViewTree from './useViewTree';
import { ZetkinViewFolder } from '../components/types';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';

interface UseFolderReturn {
  folderFuture: IFuture<ZetkinViewFolder>;
}

export default function useFolder(
  orgId: number,
  folderId?: number | null
): UseFolderReturn {
  const itemsFuture = useViewTree(orgId);
  const getFolder = (): IFuture<ZetkinViewFolder> => {
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    return new ResolvedFuture(
      itemsFuture.data.folders.find((folder) => folder.id == folderId) || null
    );
  };
  const folderFuture = getFolder();

  return { folderFuture };
}
