import Link from 'next/link';
import { Box, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { FormatListNumbered, Link as LinkIcon, NaturePeople, Share, VideoLibrary } from '@material-ui/icons';

import getTaskStatus from 'utils/getTaskStatus';
import { TASK_TYPE } from 'types/tasks';
import { ZetkinTask } from 'types/zetkin';

import TaskStatusChip from '../TaskStatusChip';
import TaskStatusText from '../TaskStatusText';

const TASK_TYPE_ICONS: {[key in TASK_TYPE]: React.ReactNode} = {
    [TASK_TYPE.OFFLINE]: <NaturePeople />,
    [TASK_TYPE.COLLECT_DEMOGRAPHICS]: <FormatListNumbered />,
    [TASK_TYPE.SHARE_LINK]: <Share />,
    [TASK_TYPE.SHARE_IMAGE]: <Share />,
    [TASK_TYPE.VISIT_LINK]: <LinkIcon />,
    [TASK_TYPE.WATCH_VIDEO]: <VideoLibrary />,
};

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
                <ListItemIcon>
                    { TASK_TYPE_ICONS[task.type] }
                </ListItemIcon>
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
