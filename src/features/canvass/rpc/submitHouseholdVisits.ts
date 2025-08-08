import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ZetkinHouseholdVisit,
  ZetkinHouseholdVisitPostBody,
} from 'features/canvass/types';

const YesNoMetricResponseSchema = z.object({
  metric_id: z.number(),
  response: z.union([z.literal('yes'), z.literal('no')]),
});

const Scale5MetricResponseSchema = z.object({
  metric_id: z.number(),
  response: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.string(),
  ]),
});

const MetricResponseSchema = z.union([
  YesNoMetricResponseSchema,
  Scale5MetricResponseSchema,
]);

const paramsSchema = z.object({
  assignmentId: z.number(),
  households: z.array(z.number()),
  orgId: z.number(),
  responses: z.array(MetricResponseSchema),
});

type Params = z.input<typeof paramsSchema>;
type Result = {
  visits: ZetkinHouseholdVisit[];
};

export const submitHouseholdVisitsDef = {
  handler: handle,
  name: 'submitHouseholdVisits',
  schema: paramsSchema,
};

export default makeRPCDef<Params, Result>(submitHouseholdVisitsDef.name);

async function handle(params: Params, apiClient: IApiClient): Promise<Result> {
  const { assignmentId, households, orgId, responses } = params;

  const visits: ZetkinHouseholdVisit[] = [];

  for (const householdId of households) {
    const visit = await apiClient.post<
      ZetkinHouseholdVisit,
      ZetkinHouseholdVisitPostBody
    >(
      `/api2/orgs/${orgId}/area_assignments/${assignmentId}/households/${householdId}/visits`,
      {
        metrics: responses,
      }
    );

    visits.push(visit);
  }

  return { visits };
}
