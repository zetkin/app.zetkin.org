import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { z } from 'zod';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

const paramsSchema = z.object({
  folderId: z.number(),
  orgId: z.number(),
});

export type DeleteFolderReport = {
  foldersDeleted: (number | string)[];
  viewsDeleted: (number | string)[];
};

type Params = z.input<typeof paramsSchema>;
type Result = DeleteFolderReport;

export const deleteFolderRouteDef = {
  handler: handle,
  name: 'deleteViewFolder',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>('deleteViewFolder');

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { orgId, folderId } = params;

  const folders = await apiClient.get<ZetkinViewFolder[]>(
    `/api/orgs/${orgId}/people/view_folders`
  );
  const views = await apiClient.get<ZetkinView[]>(
    `/api/orgs/${orgId}/people/views`
  );

  const stats: DeleteFolderReport = {
    foldersDeleted: [],
    viewsDeleted: [],
  };

  await deleteFolder(apiClient, orgId, folderId, views, folders, stats);

  return stats;
}

async function deleteFolder(
  apiClient: IApiClient,
  orgId: number,
  folderId: number,
  views: ZetkinView[],
  folders: ZetkinViewFolder[],
  stats: DeleteFolderReport
) {
  // First delete it's child folders recursively
  const childFolders = folders.filter(
    (folder) => folder.parent?.id == folderId
  );
  for await (const childFolder of childFolders) {
    await deleteFolder(apiClient, orgId, childFolder.id, views, folders, stats);
  }

  // Then delete any views in the folder
  const childViews = views.filter((view) => view.folder?.id == folderId);
  for await (const childView of childViews) {
    await apiClient.delete(`/api/orgs/${orgId}/people/views/${childView.id}`);
    stats.viewsDeleted.push(childView.id);
  }

  // Finally delete the folder itself
  await apiClient.delete(`/api/orgs/${orgId}/people/view_folders/${folderId}`);
  stats.foldersDeleted.push(folderId);
}
