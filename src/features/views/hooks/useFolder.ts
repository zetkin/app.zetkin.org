import { useSelector } from 'react-redux';

import { RootState } from 'core/store';
import useViewTree from './useViewTree';
import { ZetkinViewFolder } from '../components/types';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';

interface UseFolderReturn {
  folderFuture: IFuture<ZetkinViewFolder>;
  recentlyCreatedFolder: ZetkinViewFolder | null;
}

export default function useFolder(
  orgId: number,
  folderId?: number | null
): UseFolderReturn {
  const itemsFuture = useViewTree(orgId);
  const views = useSelector((state: RootState) => state.views);

  const getFolder = (): IFuture<ZetkinViewFolder> => {
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    return new ResolvedFuture(
      itemsFuture.data.folders.find((folder) => folder.id == folderId) || null
    );
  };
  const folderFuture = getFolder();

  const recentlyCreatedFolder = views.recentlyCreatedFolder;

  return { folderFuture, recentlyCreatedFolder };
}
