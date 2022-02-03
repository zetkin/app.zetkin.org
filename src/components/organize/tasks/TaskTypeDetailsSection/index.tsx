import { ZetkinTask } from 'types/zetkin';
import {
  CollectDemographicsConfig,
  ShareLinkConfig,
  TASK_TYPE,
  VisitLinkConfig,
  WatchVideoConfig,
} from 'types/tasks';

import CollectDemographicsDetails from './CollectDemographicsDetails';
import ShareLinkDetails from './ShareLinkDetails';
import VisitLinkDetails from './VisitLinkDetails';
import WatchVideoDetails from './WatchVideoDetails';

interface TaskTypeDetailsProps {
  task: ZetkinTask;
}

const TaskTypeDetailsSection: React.FunctionComponent<TaskTypeDetailsProps> = ({
  task,
}) => {
  if (task.type === TASK_TYPE.OFFLINE) return null;

  return (
    <>
      {/* Config Properties */}
      {task.type === TASK_TYPE.VISIT_LINK && (
        <VisitLinkDetails taskConfig={task.config as VisitLinkConfig} />
      )}
      {task.type === TASK_TYPE.SHARE_LINK && (
        <ShareLinkDetails taskConfig={task.config as ShareLinkConfig} />
      )}
      {task.type === TASK_TYPE.WATCH_VIDEO && (
        <WatchVideoDetails taskConfig={task.config as WatchVideoConfig} />
      )}
      {task.type === TASK_TYPE.COLLECT_DEMOGRAPHICS && (
        <CollectDemographicsDetails
          taskConfig={task.config as CollectDemographicsConfig}
        />
      )}
    </>
  );
};

export default TaskTypeDetailsSection;
