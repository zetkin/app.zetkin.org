import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';

export const paramsSchema = z.object({
  emailId: z.number(),
  orgId: z.number(),
});
export type Params = z.input<typeof paramsSchema>;
export type Result = {
  html: string;
};

export default makeRPCDef<Params, Result>('renderEmail');
