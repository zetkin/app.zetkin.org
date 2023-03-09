import { RPCRouter } from './router';

import { createNewViewRouteDef } from 'features/views/rpc/createNew/server';
import { deleteFolderRouteDef } from 'features/views/rpc/deleteFolder';
import { getSurveyStatsDef } from 'features/surveys/rpc/getSurveyStats';

export function createRPCRouter() {
  const rpcRouter = new RPCRouter();

  rpcRouter.register(deleteFolderRouteDef);
  rpcRouter.register(createNewViewRouteDef);
  rpcRouter.register(getSurveyStatsDef);

  return rpcRouter;
}
