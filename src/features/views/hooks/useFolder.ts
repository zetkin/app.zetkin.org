import { IFuture, FutureBase, ResolvedFuture } from 'core/caching/futures';
import { ZetkinViewFolder } from '../components/types';
import useViewTree from './useViewTree';

interface UseFolderReturn {
  folderFuture: IFuture<ZetkinViewFolder>;
}

export default function useFolder(
  orgId: number,
  folderId?: number | null
): UseFolderReturn {
  const getFolder = (): IFuture<ZetkinViewFolder> => {
    const itemsFuture = useViewTree(orgId);
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
