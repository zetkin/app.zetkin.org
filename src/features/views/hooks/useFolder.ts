import deleteViewFolder from '../rpc/deleteFolder';
import useViewTree from './useViewTree';
import { ZetkinViewFolder } from '../components/types';
import {
  folderCreate,
  folderCreated,
  folderDeleted,
  folderUpdate,
  folderUpdated,
} from '../store';
import {
  FutureBase,
  IFuture,
  PromiseFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type ZetkinViewFolderPostBody = {
  parent_id?: number;
  title: string;
};

type ZetkinViewFolderUpdateBody = Partial<
  Omit<ZetkinViewFolder, 'id' | 'parent'>
> & {
  parent_id?: number | null;
};

interface UseFolderReturn {
  createFolder: (title: string, folderId?: number) => Promise<ZetkinViewFolder>;
  deleteFolder: (folderId: number) => void;
  folderFuture: IFuture<ZetkinViewFolder>;
  recentlyCreatedFolder: ZetkinViewFolder | null;
  updateFolder: (
    orgId: number,
    folderId: number,
    data: ZetkinViewFolderUpdateBody
  ) => PromiseFuture<ZetkinViewFolder>;
}

export default function useFolder(
  orgId: number,
  folderId?: number | null
): UseFolderReturn {
  const itemsFuture = useViewTree(orgId);
  const views = useAppSelector((state) => state.views);
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const folderFuture = itemsFuture.data
    ? new ResolvedFuture(
        itemsFuture.data.folders.find((folder) => folder.id == folderId) || null
      )
    : new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);

  const recentlyCreatedFolder = views.recentlyCreatedFolder;

  const createFolder = async (
    title: string,
    folderId?: number
  ): Promise<ZetkinViewFolder> => {
    dispatch(folderCreate());
    const folder = await apiClient.post<
      ZetkinViewFolder,
      ZetkinViewFolderPostBody
    >(`/api/orgs/${orgId}/people/view_folders`, {
      parent_id: folderId,
      title,
    });

    dispatch(folderCreated(folder));
    return folder;
  };

  const deleteFolder = async (folderId: number): Promise<void> => {
    const report = await apiClient.rpc(deleteViewFolder, { folderId, orgId });
    dispatch(folderDeleted(report));
  };

  const updateFolder = (
    orgId: number,
    folderId: number,
    data: ZetkinViewFolderUpdateBody
  ) => {
    const mutating = Object.keys(data);
    dispatch(folderUpdate([folderId, mutating]));
    const promise = apiClient
      .patch<ZetkinViewFolder>(
        `/api/orgs/${orgId}/people/view_folders/${folderId}`,
        data
      )
      .then((folder) => {
        dispatch(folderUpdated([folder, mutating]));
        return folder;
      });

    return new PromiseFuture(promise);
  };
  return {
    createFolder,
    deleteFolder,
    folderFuture,
    recentlyCreatedFolder,
    updateFolder,
  };
}
