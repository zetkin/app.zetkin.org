import Link from 'next/link';
import { Box, ListItem, ListItemText, Typography } from '@material-ui/core';

import getTaskStatus from 'utils/getTaskStatus';
import { ZetkinTask } from 'types/zetkin';

import TaskStatusChip from '../TaskStatusChip';
import TaskStatusText from '../TaskStatusText';

interface TaskListItemProps {
    task: ZetkinTask;
    hrefBase: string;
}


const TaskListItem = ({ task, hrefBase }: TaskListItemProps): JSX.Element => {
    const { id, title } = task;
    const taskStatus = getTaskStatus(task);

    return (
        <Link
            href={ hrefBase + `/calendar/tasks/${id}` }
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
                        <TaskStatusText task={ task }/>
                    </Typography>
                </ListItemText>
            </ListItem>
        </Link>
    );
};

export default TaskListItem;
