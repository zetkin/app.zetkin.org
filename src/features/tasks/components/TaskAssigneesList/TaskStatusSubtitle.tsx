import { Box } from '@mui/material';

import { Msg } from 'core/i18n';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import {
  ASSIGNED_STATUS,
  ZetkinAssignedTask,
} from 'features/tasks/components/types';
import { Done, NotInterested } from '@mui/icons-material';

import messageIds from 'features/tasks/l10n/messageIds';

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
          <Msg
            id={messageIds.assignees.completedStates.completed}
            values={{
              time: <ZUIRelativeTime datetime={task.completed as string} />,
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
          <Msg
            id={messageIds.assignees.completedStates.ignored}
            values={{
              time: <ZUIRelativeTime datetime={task.ignored as string} />,
            }}
          />
        </Box>
      </Box>
    );
  } else {
    return <Msg id={messageIds.assignees.completedStates.notCompleted} />;
  }
};

export default TaskStatusSubtitle;
