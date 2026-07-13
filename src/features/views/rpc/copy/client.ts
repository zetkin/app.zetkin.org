import { z } from 'zod';

import { makeRPCDef } from 'core/rpc/types';
import { ZetkinView } from 'utils/types/zetkin';

export const paramsSchema = z.object({
  folderId: z.number().or(z.undefined()),
  oldViewId: z.number(),
  orgId: z.number(),
  title: z.string(),
});

export type Params = z.input<typeof paramsSchema>;
export type Result = ZetkinView;

export default makeRPCDef<Params, Result>('copyView');
