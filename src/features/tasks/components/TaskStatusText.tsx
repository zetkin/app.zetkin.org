import { Msg } from 'core/i18n';
import { ZetkinTask } from 'utils/types/zetkin';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';

import messageIds from '../l10n/messageIds';

interface TaskStatusTextProps {
  task: ZetkinTask;
}
const TaskStatusText: React.FunctionComponent<TaskStatusTextProps> = ({
  task,
}) => {
  const { published, deadline, expires } = task;
  const taskStatus = getTaskStatus(task);
  return (
    <>
      {/* Scheduled */}
      {taskStatus === TASK_STATUS.SCHEDULED && published && (
        <Msg
          id={messageIds.taskListItem.relativeTimes.scheduled}
          values={{
            time: <ZUIRelativeTime datetime={published} />,
          }}
        />
      )}
      {/* Active and definite*/}
      {taskStatus === TASK_STATUS.ACTIVE && deadline && (
        <Msg
          id={messageIds.taskListItem.relativeTimes.active}
          values={{
            time: <ZUIRelativeTime datetime={deadline} />,
          }}
        />
      )}
      {/* Active and indefinite */}
      {taskStatus === TASK_STATUS.ACTIVE && !deadline && published && (
        <Msg
          id={messageIds.taskListItem.relativeTimes.indefinite}
          values={{
            time: <ZUIRelativeTime datetime={published} />,
          }}
        />
      )}
      {/* Closed and has expiry date */}
      {taskStatus === TASK_STATUS.CLOSED && expires && (
        <Msg
          id={messageIds.taskListItem.relativeTimes.expires}
          values={{ time: <ZUIRelativeTime datetime={expires} /> }}
        />
      )}
      {/* Closed and no expiry date */}
      {taskStatus === TASK_STATUS.CLOSED && !expires && deadline && (
        <Msg
          id={messageIds.taskListItem.relativeTimes.closed}
          values={{
            time: <ZUIRelativeTime datetime={deadline} />,
          }}
        />
      )}
      {/* Expired */}
      {taskStatus === TASK_STATUS.EXPIRED && expires && (
        <Msg
          id={messageIds.taskListItem.relativeTimes.expired}
          values={{ time: <ZUIRelativeTime datetime={expires} /> }}
        />
      )}
    </>
  );
};

export default TaskStatusText;
