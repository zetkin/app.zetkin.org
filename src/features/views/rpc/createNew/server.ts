import IApiClient from 'core/api/client/IApiClient';
import { NextApiRequest } from 'next';
import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
  PendingZetkinViewColumn,
  ZetkinView,
  ZetkinViewColumn,
} from '../../components/types';
import { getBrowserLanguage, getMessages } from 'utils/locale';

import { Params, paramsSchema, Result } from './client';

export const createNewViewRouteDef = {
  handler: handle,
  name: 'createNewView',
  schema: paramsSchema,
};

type ZetkinViewPostBody = Pick<ZetkinView, 'title'> & {
  folder_id?: number;
};

async function handle(
  params: Params,
  apiClient: IApiClient,
  req: NextApiRequest
): Promise<Result> {
  const { folderId, orgId, rows } = params;
  const lang = getBrowserLanguage(req);

  const messages = await getMessages(lang, ['misc']);

  const newView = await apiClient.post<ZetkinView, ZetkinViewPostBody>(
    `/api/orgs/${orgId}/people/views`,
    {
      folder_id: folderId || undefined,
      title: messages['misc.views.newViewFields.title'],
    }
  );

  // Create "First name" column
  await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
    `/api/orgs/${orgId}/people/views/${newView.id}/columns`,
    {
      config: {
        field: NATIVE_PERSON_FIELDS.FIRST_NAME,
      },
      title: messages['misc.nativePersonFields.first_name'],
      type: COLUMN_TYPE.PERSON_FIELD,
    }
  );

  // Create "Last name" column
  await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
    `/api/orgs/${orgId}/people/views/${newView.id}/columns`,
    {
      config: {
        field: NATIVE_PERSON_FIELDS.LAST_NAME,
      },
      title: messages['misc.nativePersonFields.last_name'],
      type: COLUMN_TYPE.PERSON_FIELD,
    }
  );

  // Add rows if any
  if (rows?.length) {
    for await (const personId of rows) {
      await apiClient.put(
        `/api/orgs/${orgId}/people/views/${newView.id}/rows/${personId}`
      );
    }
  }

  return newView;
}
