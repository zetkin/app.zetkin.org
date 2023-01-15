import { NextApiRequest, NextApiResponse } from 'next';

import BackendApiClient from 'core/api/client/BackendApiClient';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import {
  COLUMN_TYPE,
  PendingZetkinViewColumn,
  ZetkinView,
  ZetkinViewColumn,
} from 'features/views/components/types';
import { getBrowserLanguage, getMessages } from 'utils/locale';

export interface CreateNewViewReqBody {
  rows?: number[];
}

type ZetkinViewPostBody = Pick<ZetkinView, 'title'> & {
  folder_id?: number;
};

const createNewView = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    query: { folderId, orgId },
    method,
    body,
  } = req;

  // Return error if method other than POST
  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const lang = getBrowserLanguage(req);

  const messages = await getMessages(lang, ['misc']);

  const client = new BackendApiClient(req.headers);

  try {
    const newView = await client.post<ZetkinView, ZetkinViewPostBody>(
      `/api/orgs/${orgId}/people/views`,
      {
        folder_id: parseInt(folderId as string) || undefined,
        title: messages['misc.views.newViewFields.title'],
      }
    );

    // Create "First name" column
    await client.post<ZetkinViewColumn, PendingZetkinViewColumn>(
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
    await client.post<ZetkinViewColumn, PendingZetkinViewColumn>(
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
    const { rows } = body as CreateNewViewReqBody;
    if (rows?.length) {
      for await (const personId of rows) {
        await client.put(
          `/api/orgs/${orgId}/people/views/${newView.id}/rows/${personId}`
        );
      }
    }

    res.status(200).json({ data: newView });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export default createNewView;
