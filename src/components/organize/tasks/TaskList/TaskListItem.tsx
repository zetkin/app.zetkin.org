import { FormattedMessage } from 'react-intl';
import Link from 'next/link';
import { Box, ListItem, ListItemText, Typography } from '@material-ui/core';

import ZetkinRelativeTime from '../../../ZetkinRelativeTime';
import { ZetkinTask } from '../../../../types/zetkin';

import TaskStatusChip from '../TaskStatusChip';
import getTaskStatus, { TASK_STATUS } from '../../../../utils/getTaskStatus';

interface TaskListItemProps {
    task: ZetkinTask;
    hrefBase: string;
}


const TaskListItem = ({ task, hrefBase }: TaskListItemProps): JSX.Element => {
    const { id, title, published, deadline, expires } = task;
    const taskStatus = getTaskStatus(task);

    return (
        <Link
            href={ hrefBase + `/tasks/${id}` }
            passHref>
            <ListItem button component="a">
                <ListItemText>
                    { /* Title and Chip */ }
                    <Box alignItems="center" display="flex">
                        <Typography component="h5" variant="body1">
                            { title }
                        </Typography>
                        <Box ml={ 1 }>
                            <TaskStatusChip status={ taskStatus }/>
                        </Box>
                    </Box>
                    { /* Description */ }
                    <Typography color="textPrimary" variant="body2">
                        { /* Scheduled */ }
                        { taskStatus === TASK_STATUS.SCHEDULED && published && (
                            <FormattedMessage
                                id="misc.tasks.taskListItem.relativeTimes.scheduled"
                                values={{ time:  <ZetkinRelativeTime datetime={ published } /> }}
                            />
                        ) }
                        { /* Active and definite*/ }
                        { taskStatus === TASK_STATUS.ACTIVE && deadline && (
                            <FormattedMessage
                                id="misc.tasks.taskListItem.relativeTimes.active"
                                values={{ time: <ZetkinRelativeTime datetime={ deadline } /> }}
                            />
                        ) }
                        { /* Active and indefinite */ }
                        { taskStatus === TASK_STATUS.ACTIVE && !deadline && published && (
                            <FormattedMessage
                                id="misc.tasks.taskListItem.relativeTimes.indefinite"
                                values={{ time: <ZetkinRelativeTime datetime={ published } /> }}
                            />
                        ) }
                        { /* Closed and has expiry date */ }
                        { taskStatus === TASK_STATUS.CLOSED && expires && (
                            <FormattedMessage
                                id="misc.tasks.taskListItem.relativeTimes.expires"
                                values={{ time: <ZetkinRelativeTime datetime={ expires } /> }}
                            />
                        ) }
                        { /* Closed and no expiry date */ }
                        { taskStatus === TASK_STATUS.CLOSED && !expires && deadline && (
                            <FormattedMessage
                                id="misc.tasks.taskListItem.relativeTimes.closed"
                                values={{ time: <ZetkinRelativeTime datetime={ deadline } /> }}
                            />
                        ) }
                    </Typography>
                </ListItemText>
            </ListItem>
        </Link>
    );
};

export default TaskListItem;
