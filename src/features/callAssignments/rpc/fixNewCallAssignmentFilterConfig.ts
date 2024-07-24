import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinQuery } from 'utils/types/zetkin';
import {
  CALL_OPERATOR,
  FILTER_TYPE,
} from 'features/smartSearch/components/types';

const paramsSchema = z.object({
  callAssignmentId: z.number(),
  orgId: z.number(),
  queryId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinQuery;

export const fixNewCallAssignmentFilterConfigDef = {
  handler: handle,
  name: 'updateQuery',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(
  fixNewCallAssignmentFilterConfigDef.name
);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { callAssignmentId, orgId, queryId } = params;

  const updatedQuery = await apiClient.patch<ZetkinQuery>(
    `/api/orgs/${orgId}/people/queries/${queryId}`,
    {
      filter_spec: [
        {
          config: {
            assignment: callAssignmentId,
            operator: CALL_OPERATOR.REACHED,
          },
          type: FILTER_TYPE.CALL_HISTORY,
        },
      ],
    }
  );

  return updatedQuery;
}
