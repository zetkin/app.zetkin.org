import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { HouseholdWithColor } from 'features/canvass/types';

export const paramsSchema = z.object({
  households: z.array(
    z.object({
      level: z.number(),
      title: z.string().optional(),
    })
  ),
  locationId: z.number(),
  orgId: z.number(),
});

export type Params = z.input<typeof paramsSchema>;
export type Result = HouseholdWithColor[];

export default makeRPCDef<Params, Result>('createHouseholds');
