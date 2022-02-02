import { Box } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { ASSIGNED_STATUS, ZetkinAssignedTask } from 'types/tasks';
import { Done, NotInterested } from '@material-ui/icons';

const TaskStatusSubtitle = ({
  task,
}: {
  task: ZetkinAssignedTask;
}): JSX.Element => {
  if (task.completed) {
    return (
      <Box alignItems="center" display="flex">
        <Done fontSize="small" />
        <Box>
          <FormattedMessage
            id="misc.tasks.taskAssigneesList.completedStates.completed"
            values={{
              time: <ZetkinRelativeTime datetime={task.completed as string} />,
            }}
          />
        </Box>
      </Box>
    );
  } else if (!task.completed && task.status === ASSIGNED_STATUS.IGNORED) {
    return (
      <Box alignItems="center" display="flex">
        <NotInterested fontSize="small" />
        <Box>
          <FormattedMessage
            id="misc.tasks.taskAssigneesList.completedStates.ignored"
            values={{
              time: <ZetkinRelativeTime datetime={task.ignored as string} />,
            }}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <FormattedMessage id="misc.tasks.taskAssigneesList.completedStates.notCompleted" />
    );
  }
};

export default TaskStatusSubtitle;
