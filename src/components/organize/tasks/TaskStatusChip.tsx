import { Chip } from '@material-ui/core';
import { useIntl } from 'react-intl';

import { TASK_STATUS } from 'utils/getTaskStatus';

enum ChipColors {
  active = '#6CC551',
  closed = '#FF4242',
  draft = '',
  expired = 'grey',
  scheduled = '#4A8FE7',
}

interface TaskStatusChipProps {
  status: TASK_STATUS;
}

const TaskStatusChip: React.FunctionComponent<TaskStatusChipProps> = ({
  status,
}) => {
  const intl = useIntl();
  return (
    <Chip
      label={intl.formatMessage({ id: `misc.tasks.statuses.${status}` })}
      size="small"
      style={{ backgroundColor: ChipColors[status] }}
      variant="outlined"
    />
  );
};

export default TaskStatusChip;
