import { useSelector, useStore } from 'react-redux';

import createNew from '../rpc/createNew/client';
import deleteViewFolder from '../rpc/deleteFolder';
import { RootState } from 'core/store';
import shouldLoad from 'core/caching/shouldLoad';
import { ViewTreeData } from 'pages/api/views/tree';
import {
  allItemsLoad,
  allItemsLoaded,
  folderCreate,
  folderCreated,
  folderDeleted,
  viewCreate,
  viewCreated,
  viewDeleted,
} from '../store';
import {
  FutureBase,
  IFuture,
  PromiseFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { useApiClient, useEnv } from 'core/hooks';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

type ZetkinViewFolderPostBody = {
  parent_id?: number;
  title: string;
};

interface UseViewBrowserReturn {
  createFolder: (title: string, folderId?: number) => Promise<ZetkinViewFolder>;
  createView: (folderId?: number, rows?: number[]) => void;
  deleteFolder: (folderId: number) => void;
  deleteView: (viewId: number) => void;
  folderData: {
    data: ZetkinViewFolder | null;
    error: unknown | null;
    isLoading: boolean;
  };
}
export default function useViewBrowser(
  orgId: number,
  folderId?: number
): UseViewBrowserReturn {
  const apiClient = useApiClient();
  const env = useEnv();
  const store = useStore();
  const views = useSelector((state: RootState) => state.views);

  const createFolder = async (
    title: string,
    folderId?: number
  ): Promise<ZetkinViewFolder> => {
    store.dispatch(folderCreate());
    const folder = await apiClient.post<
      ZetkinViewFolder,
      ZetkinViewFolderPostBody
    >(`/api/orgs/${orgId}/people/view_folders`, {
      parent_id: folderId,
      title,
    });

    store.dispatch(folderCreated(folder));
    return folder;
  };

  const createView = async (
    folderId = 0,
    rows: number[] = []
  ): Promise<ZetkinView> => {
    store.dispatch(viewCreate());
    const view = await apiClient.rpc(createNew, {
      folderId,
      orgId,
      rows,
    });
    store.dispatch(viewCreated(view));
    env.router.push(
      `/organize/${view.organization.id}/people/lists/${view.id}`
    );
    return view;
  };

  const deleteFolder = async (folderId: number): Promise<void> => {
    const report = await apiClient.rpc(deleteViewFolder, { folderId, orgId });
    store.dispatch(folderDeleted(report));
  };

  const deleteView = async (viewId: number): Promise<void> => {
    await apiClient.delete(`/api/orgs/${orgId}/people/views/${viewId}`);
    store.dispatch(viewDeleted(viewId));
  };

  const getFolder = (): IFuture<ZetkinViewFolder> => {
    const itemsFuture = getViewTree(orgId);
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    return new ResolvedFuture(
      itemsFuture.data.folders.find((folder) => folder.id == folderId) || null
    );
  };

  const getViewTree = (orgId: number): IFuture<ViewTreeData> => {
    if (shouldLoad(views.folderList) || shouldLoad(views.viewList)) {
      store.dispatch(allItemsLoad());
      const promise = apiClient
        .get<ViewTreeData>(`/api/views/tree?orgId=${orgId}`)
        .then((items) => {
          store.dispatch(allItemsLoaded(items));
          return items;
        });
      return new PromiseFuture(promise);
    } else {
      return new ResolvedFuture({
        folders: views.folderList.items.map((item) => item.data!),
        views: views.viewList.items.map((item) => item.data!),
      });
    }
  };
  return {
    createFolder,
    createView,
    deleteFolder,
    deleteView,
    folderData: {
      data: getFolder().data,
      error: getFolder().error,
      isLoading: getFolder().isLoading,
    },
  };
}
