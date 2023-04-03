import { createRPCRouter } from 'core/rpc';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const router = createRPCRouter();
  await router.handle(req, res);
}
