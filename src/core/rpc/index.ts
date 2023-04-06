import { RPCRouter } from './router';

import { addBulkOptionsDef } from 'features/surveys/rpc/addBulkOptions';
import { createNewViewRouteDef } from 'features/views/rpc/createNew/server';
import { deleteFolderRouteDef } from 'features/views/rpc/deleteFolder';
import { getOrganizerActionViewRouteDef } from 'features/views/rpc/getOrganizerActionView/server';
import { getSurveyStatsDef } from 'features/surveys/rpc/getSurveyStats';
import { getTaskStatsRouteDef } from 'features/tasks/rpc/getTaskStats';

export function createRPCRouter() {
  const rpcRouter = new RPCRouter();

  rpcRouter.register(deleteFolderRouteDef);
  rpcRouter.register(createNewViewRouteDef);
  rpcRouter.register(getOrganizerActionViewRouteDef);
  rpcRouter.register(getSurveyStatsDef);
  rpcRouter.register(getTaskStatsRouteDef);
  rpcRouter.register(addBulkOptionsDef);

  return rpcRouter;
}
