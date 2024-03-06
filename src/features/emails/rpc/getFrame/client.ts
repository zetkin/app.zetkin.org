import { makeRPCDef } from 'core/rpc/types';
import { z } from 'zod';

import { HtmlFrame } from 'features/emails/types';

export const paramsSchema = z.object({
  frameId: z.number(),
  orgId: z.number(),
});

export type Params = z.input<typeof paramsSchema>;
export type Result = HtmlFrame;

export default makeRPCDef<Params, Result>('getFrame');
