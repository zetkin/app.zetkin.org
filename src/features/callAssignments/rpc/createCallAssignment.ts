import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinCallAssignment,
  ZetkinCallAssignmentPostBody,
  ZetkinQuery,
} from 'utils/types/zetkin';
import {
  CALL_OPERATOR,
  FILTER_TYPE,
} from 'features/smartSearch/components/types';

const paramsSchema = z.object({
  callAssignment: z.object({
    campaign: z.union([
      z.object({
        id: z.number(),
        title: z.string(),
      }),
      z.null(),
      z.undefined(),
    ]),
    cooldown: z.optional(z.number()),
    description: z.optional(z.string()),
    disable_caller_notes: z.optional(z.boolean()),
    end_date: z.optional(z.string().nullable()),
    expose_target_details: z.optional(z.boolean()),
    instructions: z.optional(z.string()),
    start_date: z.optional(z.string().nullable()),
    title: z.optional(z.string()),
  }),
  campId: z.number(),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinCallAssignment;

export const createCallAssignmentDef = {
  handler: handle,
  name: 'createCallAssignment',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(createCallAssignmentDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { callAssignment, campId, orgId } = params;

  const assignment = await apiClient.post<ZetkinCallAssignmentPostBody>(
    `/api/orgs/${orgId}/campaigns/${campId}/call_assignments`,
    //goal_filters and target_filters are required by server when
    //making a POST to create call_assignment, so adding them here.
    { ...callAssignment, goal_filters: [], target_filters: [] }
  );

  if (assignment.goal) {
    const queryId = assignment.goal.id;
    const updatedGoal = await apiClient.patch<ZetkinQuery>(
      `/api/orgs/${orgId}/people/queries/${queryId}`,
      {
        filter_spec: [
          {
            config: {
              assignment: assignment.id,
              operator: CALL_OPERATOR.REACHED,
            },
            type: FILTER_TYPE.CALL_HISTORY,
          },
        ],
      }
    );
    assignment.goal = updatedGoal;
  }

  return assignment as unknown as ZetkinCallAssignment;
}
