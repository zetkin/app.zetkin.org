import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { Zetkin2Household } from 'features/canvass/types';

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
export type Result = Zetkin2Household[];

export default makeRPCDef<Params, Result>('createHouseholds');
