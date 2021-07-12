import { createStyles } from '@material-ui/core/styles';
import NextLink from 'next/link';
import { Theme } from '@material-ui/core/styles';
import { Card, Link, ListItem, makeStyles, Typography } from '@material-ui/core';

import { ZetkinTask } from '../../../../types/zetkin';

import ZetkinRelativeTime from '../../../ZetkinRelativeTime';

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

    const isPublished = false;
    const isDeadlinePassed = false;
    const isExpired = false;

    const taskStates = {
        isActive: isPublished && !isDeadlinePassed, // Has been published, but not at deadline
        isClosed: isPublished && isDeadlinePassed && !isExpired,  // Has been published, and deadline passed, not expired
        isDraft: !publishedDate, // No value for "publishedDate"
        isIndefinite: isPublished && !deadline, // Has been published, but doesn't end
        isReadyToPublish: publishedDate && !isPublished, // Has value for publishedDate, but not yet published
    };

    return (
        <NextLink href={ hrefBase + `/tasks/${id}` } passHref>
            <Link color="inherit" underline="none" variant="subtitle2">
                <ListItem>
                    <Card className={ classes.MuiCard }>
                        <Typography component="h3" variant="h5">
                            { title }
                        </Typography>
                        <Typography color="textPrimary">
                            { published && (
                                <ZetkinRelativeTime datetime={ published } />
                            ) }
                        </Typography>
                    </Card>
                </ListItem>
            </Link>
        </NextLink>
    );
};

export default TaskListItem;
