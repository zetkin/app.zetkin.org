import { RPCRouter } from './router';

import { addBulkOptionsDef } from 'features/surveys/rpc/addBulkOptions';
import { copyEmailDef } from 'features/emails/rpc/copyEmail';
import { copyEventsDef } from 'features/events/rpc/copyEvents';
import { createNewViewRouteDef } from 'features/views/rpc/createNew/server';
import { deleteEventsDef } from 'features/events/rpc/deleteEvents';
import { deleteFolderRouteDef } from 'features/views/rpc/deleteFolder';
import { getEventStatsDef } from 'features/events/rpc/getEventStats';
import { getNextEventDayDef } from 'features/events/rpc/getNextEventDay';
import { getOrganizerActionViewRouteDef } from 'features/views/rpc/getOrganizerActionView/server';
import { getPrevEventDayDef } from 'features/events/rpc/getPrevEventDay';
import { getSurveyStatsDef } from 'features/surveys/rpc/getSurveyStats';
import { getTaskStatsRouteDef } from 'features/tasks/rpc/getTaskStats';
import { getUserOrgTreeDef } from 'features/organizations/rpc/getUserOrgTree';
import { updateEventsDef } from 'features/events/rpc/updateEvents';

export function createRPCRouter() {
  const rpcRouter = new RPCRouter();

  rpcRouter.register(deleteFolderRouteDef);
  rpcRouter.register(createNewViewRouteDef);
  rpcRouter.register(getOrganizerActionViewRouteDef);
  rpcRouter.register(getSurveyStatsDef);
  rpcRouter.register(getTaskStatsRouteDef);
  rpcRouter.register(addBulkOptionsDef);
  rpcRouter.register(getEventStatsDef);
  rpcRouter.register(getPrevEventDayDef);
  rpcRouter.register(getNextEventDayDef);
  rpcRouter.register(updateEventsDef);
  rpcRouter.register(copyEmailDef);
  rpcRouter.register(copyEventsDef);
  rpcRouter.register(getUserOrgTreeDef);
  rpcRouter.register(deleteEventsDef);

  return rpcRouter;
}
