import { RPCRouter } from './router';

import { deleteFolderRouteDef } from 'features/views/rpc/deleteFolder';

export function createRPCRouter() {
  const rpcRouter = new RPCRouter();
  rpcRouter.register(deleteFolderRouteDef);

  return rpcRouter;
}
