import { makeRPCDef } from 'core/rpc/types';
import { z } from 'zod';

import { ZetkinView } from 'utils/types/zetkin';

export const paramsSchema = z.object({
  orgId: z.number(),
});

export type GetOrganizerActionViewReport = {
  view: (number | string)[];
};

export type Params = z.input<typeof paramsSchema>;
export type Result = ZetkinView;

export default makeRPCDef<Params, Result>('getOrganizerActionView');
