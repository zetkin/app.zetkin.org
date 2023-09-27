import { useStore } from 'react-redux';

import createNew from '../rpc/createNew/client';
import deleteViewFolder from '../rpc/deleteFolder';
import {
  folderCreate,
  folderCreated,
  folderDeleted,
  viewCreate,
  viewCreated,
  viewDeleted,
} from '../store';
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
}
export default function useViewBrowser(orgId: number): UseViewBrowserReturn {
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
  return { createFolder, createView, deleteFolder, deleteView };
}
