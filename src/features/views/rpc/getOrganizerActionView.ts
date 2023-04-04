import isEqual from 'lodash';
import { NextApiRequest } from 'next';
import { z } from 'zod';

import { getBrowserLanguage } from 'utils/locale';
import getServerMessages from 'core/i18n/server';
import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  COLUMN_TYPE,
  NATIVE_PERSON_FIELDS,
  PendingZetkinViewColumn,
  ZetkinView,
  ZetkinViewColumn,
} from '../components/types';
import {
  FILTER_TYPE,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/views/l10n/messageIds';

const paramsSchema = z.object({
  orgId: z.number(),
});

export type GetOrganizerActionViewReport = {
  view: (number | string)[];
};

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinView;

export const getOrganizerActionViewRouteDef = {
  handler: handle,
  name: 'getOrganizerActionView',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>('getOrganizerActionView');

async function handle(
  params: Params,
  apiClient: IApiClient,
  req: NextApiRequest
): Promise<Result> {
  const { orgId } = params;

  //const lang = getBrowserLanguage(req);
  //const messages = await getServerMessages(lang, messageIds);

  const views = await apiClient.get<ZetkinView[]>(
    `/api/orgs/${orgId}/people/views`
  );

  // Define an Organizer Action View
  const targetView = {
    content_query: {
      filter_spec: [
        {
          config: {
            reason: 'organizer_action_needed',
          },
          type: FILTER_TYPE.CALL_BLOCKED,
        },
      ],
    },
  };
  const targetColumns: Pick<ZetkinViewColumn, 'config' | 'type'>[] = [
    {
      config: {
        field: 'first_name',
      },
      type: COLUMN_TYPE.PERSON_FIELD,
    },
    {
      config: {
        field: 'last_name',
      },
      type: COLUMN_TYPE.PERSON_FIELD,
    },
    {
      config: {
        type: 'all_flagged',
      },
      type: COLUMN_TYPE.ORGANIZER_ACTION,
    },
  ];

  // Look for a view that matches the definition of an Organizer Action View
  let view = await Promise.all(
    views.map(async (v) => {
      if (
        v.content_query?.filter_spec.length == 1 &&
        v.content_query.filter_spec[0].type ==
          targetView.content_query.filter_spec[0].type &&
        v.content_query.filter_spec[0].config?.reason ==
          targetView.content_query.filter_spec[0].config?.reason
      ) {
        // Check the columns
        const columns = await apiClient.get<ZetkinViewColumn[]>(
          `/api/orgs/${orgId}/people/views/${v.id}/columns`
        );
        if (
          targetColumns.every((targetCol): boolean => {
            return columns.some(
              (c: ZetkinViewColumn) =>
                c.type == targetCol.type && isEqual(targetCol.config, c.config)
            );
          })
        ) {
          return v;
        }
      }
      return null;
    })
  ).then((result) => result.find((v) => v !== null));

  if (view) {
    return view;
  } else {
    view = await apiClient.post<ZetkinView, Partial<ZetkinView>>(
      `/api/orgs/${orgId}/people/views`,
      {
        //        title: messages.defaultViewTitles.organizer_action(),
        title: 'Organizer action',
      }
    );
    await apiClient.patch<{ filter_spec: ZetkinSmartSearchFilter[] }>(
      `/api/orgs/${orgId}/people/views/${view.id}/content_query`,
      {
        filter_spec: targetView.content_query.filter_spec,
      }
    );
    // Create "First name" column
    await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
      `/api/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          field: NATIVE_PERSON_FIELDS.FIRST_NAME,
        },
        // title: messages.global.personFields.first_name(),
        title: 'First name',
        type: COLUMN_TYPE.PERSON_FIELD,
      }
    );

    // Create "Last name" column
    await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
      `/api/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          field: NATIVE_PERSON_FIELDS.LAST_NAME,
        },
        // title: messages.global.personFields.last_name(),
        title: 'Last name',
        type: COLUMN_TYPE.PERSON_FIELD,
      }
    );

    // Create "Organizer action" column
    await apiClient.post<ZetkinViewColumn, PendingZetkinViewColumn>(
      `/api/orgs/${orgId}/people/views/${view.id}/columns`,
      {
        config: {
          type: 'all_flagged',
        },
        // title: messages.defaultColumnTitles.organizer_action(),
        title: 'Organizer action',
        type: COLUMN_TYPE.ORGANIZER_ACTION,
      }
    );

    return view;
  }
}
