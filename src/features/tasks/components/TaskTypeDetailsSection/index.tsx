import { ZetkinTask } from 'utils/types/zetkin';
import {
  CollectDemographicsConfig,
  ShareLinkConfig,
  TASK_TYPE,
  VisitLinkConfig,
} from 'features/tasks/components/types';
import CollectDemographicsDetails from './CollectDemographicsDetails';
import ShareLinkDetails from './ShareLinkDetails';
import VisitLinkDetails from './VisitLinkDetails';

interface TaskTypeDetailsProps {
  task: ZetkinTask;
}

const TaskTypeDetailsSection: React.FunctionComponent<TaskTypeDetailsProps> = ({
  task,
}) => {
  if (task.type === TASK_TYPE.OFFLINE) {
    return null;
  }

  return (
    <>
      {/* Config Properties */}
      {task.type === TASK_TYPE.VISIT_LINK && (
        <VisitLinkDetails taskConfig={task.config as VisitLinkConfig} />
      )}
      {task.type === TASK_TYPE.SHARE_LINK && (
        <ShareLinkDetails taskConfig={task.config as ShareLinkConfig} />
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
