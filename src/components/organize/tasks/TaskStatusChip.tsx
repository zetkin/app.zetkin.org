import { Chip } from '@material-ui/core';
import { useIntl } from 'react-intl';

import { TASK_STATUS } from 'utils/getTaskStatus';

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
  const intl = useIntl();
  return (
    <Chip
      label={intl.formatMessage({ id: `misc.tasks.statuses.${status}` })}
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
