import { Chip } from '@mui/material';

import { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

enum ChipColors {
  active = '#57a83d',
  closed = '#FF4242',
  draft = 'grey',
  expired = 'black',
  scheduled = '#317ad6',
}

interface TaskStatusChipProps {
  status: TASK_STATUS;
}

const TaskStatusChip: React.FunctionComponent<TaskStatusChipProps> = ({
  status,
}) => {
  const messages = useMessages(messageIds);

  return (
    <Chip
      label={messages.statuses[status]()}
      size="small"
      style={{
        backgroundColor: ChipColors[status],
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  );
};

export default TaskStatusChip;
