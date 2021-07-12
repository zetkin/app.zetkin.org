import { createStyles } from '@material-ui/core/styles';
import NextLink from 'next/link';
import { Theme } from '@material-ui/core/styles';
import { Card, Link, ListItem, makeStyles, Typography } from '@material-ui/core';

import ZetkinRelativeTime from '../../../ZetkinRelativeTime';
import { ZetkinTask } from '../../../../types/zetkin';

import getTaskStatus from '../getTaskStatus';
import TaskStatusChip from '../TaskStatusChip';

// If no publish date say "draft"
// If not yet published: "Will be published in 3 days"
// If published with deadline that has not passed: "Deadline [relative time]"
// If published with no deadline or one that passed: "Expires [relative time]"
// If published with no deadline or expiry date: "Published [relative time]"

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
    const { id, title, published: publishedDate, deadline, expires } = task;
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

                        { /* <Typography color="textPrimary">
                            { published && (
                                <ZetkinRelativeTime datetime={ published } />
                            ) }
                        </Typography> */ }
                    </Card>
                </ListItem>
            </Link>
        </NextLink>
    );
};

export default TaskListItem;
