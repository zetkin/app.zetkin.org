import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

const paramsSchema = z.object({
  callAssignmentId: z.number(),
  goal_filters: z.array(
    z.object({
      config: z.object({
        assignment: z.number(),
        operator: z.string(),
      }),
      type: z.string(),
    })
  ),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinCallAssignment;

export const updateCallAssignmentDef = {
  handler: handle,
  name: 'updateCallAssignment',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(updateCallAssignmentDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { callAssignmentId, orgId } = params;

  const updatedCallAssignment = (await apiClient.put<
    ZetkinCallAssignment & {
      goal_filters: {
        config: {
          assignment: number;
          operator: string;
        };
        type: string;
      }[];
    }
  >(`/api/orgs/${orgId}/call_assignments/${callAssignmentId}`, {
    goal_filters: params.goal_filters,
  })) as ZetkinCallAssignment;

  return updatedCallAssignment;
}
