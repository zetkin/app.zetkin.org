import { NextApiRequest } from 'next';

import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import IApiClient from 'core/api/client/IApiClient';
import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
  PendingZetkinViewColumn,
  ZetkinView,
  ZetkinViewColumn,
} from '../../components/types';
import { Params, paramsSchema, Result } from './client';

import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'features/views/l10n/messageIds';

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

  const messages = await getServerMessages(lang, messageIds);
  const globalMessages = await getServerMessages(lang, globalMessageIds);

  const newView = await apiClient.post<ZetkinView, ZetkinViewPostBody>(
    `/api/orgs/${orgId}/people/views`,
    {
      folder_id: folderId || undefined,
      title: messages.newViewFields.title(),
    }
  );

  // Create "First name" column
  await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
    `/api/orgs/${orgId}/people/views/${newView.id}/columns`,
    {
      config: {
        field: NATIVE_PERSON_FIELDS.FIRST_NAME,
      },
      title: globalMessages.personFields.first_name(),
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
      title: globalMessages.personFields.last_name(),
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
