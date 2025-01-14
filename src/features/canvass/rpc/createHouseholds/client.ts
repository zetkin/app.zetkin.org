import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinLocation } from 'features/areaAssignments/types';

export const paramsSchema = z.object({
  households: z.array(
    z.object({
      floor: z.union([z.number(), z.null()]).optional(),
      title: z.string().optional(),
    })
  ),
  locationId: z.string(),
  orgId: z.number(),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinLocation;

export default makeRPCDef<Params, Result>('createHouseholds');
