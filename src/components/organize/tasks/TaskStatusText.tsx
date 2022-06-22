import { FormattedMessage } from 'react-intl';

import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ZetkinTask } from 'types/zetkin';
import getTaskStatus, { TASK_STATUS } from 'utils/getTaskStatus';

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
        <FormattedMessage
          id="misc.tasks.taskListItem.relativeTimes.scheduled"
          values={{
            time: <ZetkinRelativeTime datetime={published} />,
          }}
        />
      )}
      {/* Active and definite*/}
      {taskStatus === TASK_STATUS.ACTIVE && deadline && (
        <FormattedMessage
          id="misc.tasks.taskListItem.relativeTimes.active"
          values={{
            time: <ZetkinRelativeTime datetime={deadline} />,
          }}
        />
      )}
      {/* Active and indefinite */}
      {taskStatus === TASK_STATUS.ACTIVE && !deadline && published && (
        <FormattedMessage
          id="misc.tasks.taskListItem.relativeTimes.indefinite"
          values={{
            time: <ZetkinRelativeTime datetime={published} />,
          }}
        />
      )}
      {/* Closed and has expiry date */}
      {taskStatus === TASK_STATUS.CLOSED && expires && (
        <FormattedMessage
          id="misc.tasks.taskListItem.relativeTimes.expires"
          values={{ time: <ZetkinRelativeTime datetime={expires} /> }}
        />
      )}
      {/* Closed and no expiry date */}
      {taskStatus === TASK_STATUS.CLOSED && !expires && deadline && (
        <FormattedMessage
          id="misc.tasks.taskListItem.relativeTimes.closed"
          values={{
            time: <ZetkinRelativeTime datetime={deadline} />,
          }}
        />
      )}
      {/* Expired */}
      {taskStatus === TASK_STATUS.EXPIRED && expires && (
        <FormattedMessage
          id="misc.tasks.taskListItem.relativeTimes.expired"
          values={{ time: <ZetkinRelativeTime datetime={expires} /> }}
        />
      )}
      {/* Deadline passed */}
      {taskStatus === TASK_STATUS.PASSED && deadline && (
        <FormattedMessage
          id="misc.tasks.taskListItem.relativeTimes.passed"
          values={{ time: <ZetkinRelativeTime datetime={deadline} /> }}
        />
      )}
    </>
  );
};

export default TaskStatusText;
