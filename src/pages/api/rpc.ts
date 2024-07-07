import { NextApiRequest, NextApiResponse } from 'next';

import { createRPCRouter } from 'core/rpc';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const router = createRPCRouter();
  await router.handle(req, res);
}
