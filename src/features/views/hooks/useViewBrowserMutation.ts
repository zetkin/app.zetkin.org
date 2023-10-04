import { useStore } from 'react-redux';

import createNew from '../rpc/createNew/client';
import deleteViewFolder from '../rpc/deleteFolder';
import { PromiseFuture } from 'core/caching/futures';
import {
  folderCreate,
  folderCreated,
  folderDeleted,
  folderUpdate,
  folderUpdated,
  viewCreate,
  viewCreated,
  viewDeleted,
  viewUpdate,
  viewUpdated,
} from '../store';
import { useApiClient, useEnv } from 'core/hooks';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

type ZetkinViewFolderPostBody = {
  parent_id?: number;
  title: string;
};

type ZetkinViewFolderUpdateBody = Partial<
  Omit<ZetkinViewFolder, 'id' | 'parent'>
> & {
  parent_id?: number | null;
};

type ZetkinViewUpdateBody = Partial<Omit<ZetkinView, 'id' | 'folder'>> & {
  folder_id?: number | null;
};

interface UseViewBrowserMutationReturn {
  createFolder: (title: string, folderId?: number) => Promise<ZetkinViewFolder>;
  createView: (folderId?: number, rows?: number[]) => void;
  deleteFolder: (folderId: number) => void;
  deleteView: (viewId: number) => void;
  moveItem: (
    type: 'folder' | 'view',
    id: number,
    newParentId: number | null
  ) => void;
  renameItem: (type: 'folder' | 'view', id: number, title: string) => void;
}

export default function useViewBrowserMutation(
  orgId: number
): UseViewBrowserMutationReturn {
  const apiClient = useApiClient();
  const env = useEnv();
  const store = useStore();

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

  const updateFolder = (
    orgId: number,
    folderId: number,
    data: ZetkinViewFolderUpdateBody
  ) => {
    const mutating = Object.keys(data);
    store.dispatch(folderUpdate([folderId, mutating]));
    const promise = apiClient
      .patch<ZetkinViewFolder>(
        `/api/orgs/${orgId}/people/view_folders/${folderId}`,
        data
      )
      .then((folder) => {
        store.dispatch(folderUpdated([folder, mutating]));
        return folder;
      });

    return new PromiseFuture(promise);
  };

  const updateView = (
    orgId: number,
    viewId: number,
    data: ZetkinViewUpdateBody
  ) => {
    const mutating = Object.keys(data);
    store.dispatch(viewUpdate([viewId, mutating]));
    const promise = apiClient
      .patch<ZetkinView>(`/api/orgs/${orgId}/people/views/${viewId}`, data)
      .then((view) => {
        store.dispatch(viewUpdated([view, mutating]));
        return view;
      });

    return new PromiseFuture(promise);
  };

  const moveItem = (
    type: 'folder' | 'view',
    id: number,
    newParentId: number | null
  ) => {
    if (type == 'folder') {
      updateFolder(orgId, id, { parent_id: newParentId });
    } else if (type == 'view') {
      updateView(orgId, id, { folder_id: newParentId });
    }
  };

  const renameItem = (type: 'folder' | 'view', id: number, title: string) => {
    if (type == 'folder') {
      updateFolder(orgId, id, { title });
    } else if (type == 'view') {
      updateView(orgId, id, { title });
    }
  };

  return {
    createFolder,
    createView,
    deleteFolder,
    deleteView,
    moveItem,
    renameItem,
  };
}
