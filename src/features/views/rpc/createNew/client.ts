import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinView } from 'utils/types/zetkin';

export const paramsSchema = z.object({
  folderId: z.number().or(z.undefined()),
  orgId: z.number(),
  rows: z.array(z.number()).or(z.undefined()),
});

export type Params = z.input<typeof paramsSchema>;
export type Result = ZetkinView;

export default makeRPCDef<Params, Result>('createNewView');
