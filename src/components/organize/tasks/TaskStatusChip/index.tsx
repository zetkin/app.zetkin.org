import { Chip } from '@material-ui/core';
import { useIntl } from 'react-intl';

import { TASK_STATUS } from '../getTaskStatus';

enum ChipColors {
    active = '#6CC551',
    closed = '#FF4242',
    draft = '',
    expired= 'black',
    ready = '#4A8FE7',
}

interface TaskStatusChipProps {
    status: TASK_STATUS;
}
const TaskStatusChip: React.FunctionComponent<TaskStatusChipProps> = ({ status }) => {
    const intl = useIntl();
    return (
        <Chip
            label={ intl.formatMessage( { id: `misc.tasks.statuses.${status}` }) }
            style={{ backgroundColor: ChipColors[status] }}
        />
    );
};

export default TaskStatusChip;
