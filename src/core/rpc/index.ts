import { RPCRouter } from './router';

import { createNewViewRouteDef } from 'features/views/rpc/createNew/server';
import { deleteFolderRouteDef } from 'features/views/rpc/deleteFolder';
import { getSurveyStatsDef } from 'features/surveys/rpc/getSurveyStats';
import { getTaskStatsRouteDef } from 'features/tasks/rpc/getTaskStats';

export function createRPCRouter() {
  const rpcRouter = new RPCRouter();

  rpcRouter.register(deleteFolderRouteDef);
  rpcRouter.register(createNewViewRouteDef);
  rpcRouter.register(getSurveyStatsDef);
  rpcRouter.register(getTaskStatsRouteDef);

  return rpcRouter;
}
