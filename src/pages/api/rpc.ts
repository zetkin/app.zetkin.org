import { createRPCRouter } from 'core/rpc';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const router = createRPCRouter();
  router.handle(req, res);
}
