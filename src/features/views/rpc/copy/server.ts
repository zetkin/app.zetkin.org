import IApiClient from 'core/api/client/IApiClient';
import {
  PendingZetkinViewColumn,
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../../components/types';
import { Params, paramsSchema, Result } from './client';
import { ZetkinQuery } from 'utils/types/zetkin';

export const copyViewRouteDef = {
  handler: handle,
  name: 'copyView',
  schema: paramsSchema,
};

type ZetkinViewPostBody = Pick<ZetkinView, 'title'> & {
  folder_id?: number;
};

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { folderId, orgId, oldViewId, title } = params;

  // Fetch info about column to copy
  const oldView = await apiClient.get<ZetkinView>(
    `/api/orgs/${orgId}/people/views/${oldViewId}`
  );
  const oldColumns = await apiClient.get<ZetkinViewColumn[]>(
    `/api/orgs/${orgId}/people/views/${oldViewId}/columns`
  );

  // Create new table
  const newView = await apiClient.post<ZetkinView, ZetkinViewPostBody>(
    `/api/orgs/${orgId}/people/views`,
    {
      folder_id: folderId,
      title,
    }
  );

  // Populate new table columns
  for await (const column of oldColumns) {
    await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
      `/api/orgs/${orgId}/people/views/${newView.id}/columns`,
      {
        config: column.config,
        description: column.description,
        title: column.title,
        type: column.type,
      }
    );
  }

  // Copy filters
  if (
    oldView.content_query != null &&
    oldView.content_query.filter_spec.length != 0
  ) {
    apiClient.patch<ZetkinQuery[], Pick<ZetkinQuery, 'filter_spec'>>(
      `/api/orgs/${orgId}/people/views/${newView.id}/content_query`,
      {
        filter_spec: oldView.content_query?.filter_spec,
      }
    );
  }

  // Copy manually added rows
  const rows = await apiClient.get<ZetkinViewRow[]>(
    `/api/orgs/${orgId}/people/views/${oldView.id}/rows`
  );
  if (rows.length != 0) {
    for await (const person of rows) {
      await apiClient.put(
        `/api/orgs/${orgId}/people/views/${newView.id}/rows/${person.id}`
      );
    }
  }

  return newView;
}
