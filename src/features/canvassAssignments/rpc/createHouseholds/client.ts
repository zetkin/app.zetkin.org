import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinPlace } from '../../types';

export const paramsSchema = z.object({
  households: z.array(
    z.object({
      floor: z.union([z.number(), z.null()]).optional(),
      title: z.string().optional(),
    })
  ),
  orgId: z.number(),
  placeId: z.string(),
});

type Params = z.input<typeof paramsSchema>;
type Result = ZetkinPlace;

export default makeRPCDef<Params, Result>('createHouseholds');
