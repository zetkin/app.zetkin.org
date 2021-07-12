import { createStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import NextLink from 'next/link';
import { Theme } from '@material-ui/core/styles';
import { Card, Link, ListItem, makeStyles, Typography } from '@material-ui/core';

import ZetkinRelativeTime from '../../../ZetkinRelativeTime';
import { ZetkinTask } from '../../../../types/zetkin';

import TaskStatusChip from '../TaskStatusChip';
import getTaskStatus, { TASK_STATUS } from '../getTaskStatus';

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
                            { /* Closed */ }
                            { taskStatus === TASK_STATUS.CLOSED && (
                                <>
                                    <FormattedMessage id="misc.tasks.taskListItem.relativeTimes.closed" />
                                    { ' ' }
                                    <ZetkinRelativeTime datetime={ expires } />
                                </>
                            ) }

                            { /* Scheduled */ }
                            { taskStatus === TASK_STATUS.SCHEDULED && (
                                <>
                                    <FormattedMessage id="misc.tasks.taskListItem.relativeTimes.scheduled" />
                                    { ' ' }
                                    <ZetkinRelativeTime datetime={ published } />
                                </>
                            ) }

                            { /* Active and definite*/ }
                            { taskStatus === TASK_STATUS.ACTIVE && deadline && (
                                <>
                                    <FormattedMessage id="misc.tasks.taskListItem.relativeTimes.active" />
                                    { ' ' }
                                    <ZetkinRelativeTime datetime={ deadline } />
                                </>
                            ) }
                            { /* Active and indefinite */ }
                            { taskStatus === TASK_STATUS.ACTIVE && !deadline && (
                                <>
                                    <FormattedMessage id="misc.tasks.taskListItem.relativeTimes.indefinite" />
                                    { ' ' }
                                    <ZetkinRelativeTime datetime={ published } />
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
