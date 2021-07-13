import { createStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import NextLink from 'next/link';
import { Theme } from '@material-ui/core/styles';
import { Card, Link, ListItem, makeStyles, Typography } from '@material-ui/core';

import ZetkinRelativeTime from '../../../ZetkinRelativeTime';
import { ZetkinTask } from '../../../../types/zetkin';

import TaskStatusChip from '../TaskStatusChip';
import getTaskStatus, { TASK_STATUS } from '../../../../utils/getTaskStatus';

interface TaskListItemProps {
    task: ZetkinTask;
    hrefBase: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    MuiCard: {
        '&:hover': {
            color: theme.palette.primary.main,
        },
        padding: '1rem',
        width: '100%',
    },
}));

const TaskListItem = ({ task, hrefBase }: TaskListItemProps): JSX.Element => {
    const classes = useStyles();
    const { id, title, published, deadline, expires } = task;
    const taskStatus = getTaskStatus(task);

    return (
        <NextLink href={ hrefBase + `/tasks/${id}` } passHref>
            <Link color="inherit" underline="none" variant="subtitle2">
                <ListItem>
                    <Card className={ classes.MuiCard }>
                        <TaskStatusChip status={ taskStatus }/>

                        <Typography component="h3" variant="h5">
                            { title }
                        </Typography>

                        <Typography color="textPrimary">
                            { /* Scheduled */ }
                            { taskStatus === TASK_STATUS.SCHEDULED && published && (
                                <>
                                    <FormattedMessage
                                        id="misc.tasks.taskListItem.relativeTimes.scheduled"
                                        values={{ time:  <ZetkinRelativeTime datetime={ published } /> }}
                                    />
                                </>
                            ) }

                            { /* Active and definite*/ }
                            { taskStatus === TASK_STATUS.ACTIVE && deadline && (
                                <>
                                    <FormattedMessage
                                        id="misc.tasks.taskListItem.relativeTimes.active"
                                        values={{ time: <ZetkinRelativeTime datetime={ deadline } /> }}
                                    />
                                </>
                            ) }
                            { /* Active and indefinite */ }
                            { taskStatus === TASK_STATUS.ACTIVE && !deadline && published && (
                                <>
                                    <FormattedMessage
                                        id="misc.tasks.taskListItem.relativeTimes.indefinite"
                                        values={{ time: <ZetkinRelativeTime datetime={ published } /> }}
                                    />
                                </>
                            ) }
                            { /* Closed and has expiry date */ }
                            { taskStatus === TASK_STATUS.CLOSED && expires && (
                                <>
                                    <FormattedMessage
                                        id="misc.tasks.taskListItem.relativeTimes.expires"
                                        values={{ time: <ZetkinRelativeTime datetime={ expires } /> }}
                                    />
                                </>
                            ) }
                            { /* Closed and no expiry date */ }
                            { taskStatus === TASK_STATUS.CLOSED && !expires && deadline && (
                                <>
                                    <FormattedMessage
                                        id="misc.tasks.taskListItem.relativeTimes.closed"
                                        values={{ time: <ZetkinRelativeTime datetime={ deadline } /> }}
                                    />
                                </>
                            ) }
                        </Typography>
                    </Card>
                </ListItem>
            </Link>
        </NextLink>
    );
};

export default TaskListItem;
