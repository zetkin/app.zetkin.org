import { createStyles } from '@material-ui/core/styles';
import NextLink from 'next/link';
import { Theme } from '@material-ui/core/styles';
import { Card, Link, ListItem, makeStyles, Typography } from '@material-ui/core';
import { FormattedDate, FormattedTime } from 'react-intl';

import { ZetkinEvent } from '../../../types/zetkin';

interface EventListItemProps {
    event: ZetkinEvent;
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

const EventListItem = ({ event, hrefBase }: EventListItemProps): JSX.Element => {
    const classes = useStyles();
    const { id, title, activity, location, start_time, end_time } = event;

    return (
        <NextLink href={ hrefBase + `/events/${id}` } passHref>
            <Link color="inherit" underline="none" variant="subtitle2">
                <ListItem>
                    <Card className={ classes.MuiCard }>
                        <Typography component="h3" variant="h5">
                            { title || activity.title }
                        </Typography>
                        <Typography color="textPrimary">
                            <FormattedDate
                                month="long"
                                value={ new Date(start_time) }
                                year="2-digit"
                            />
                            { `  ` }
                            <FormattedTime
                                value={ new Date(start_time) }
                            />
                            { ` - ` }
                            <FormattedDate
                                month="long"
                                value={ new Date(end_time) }
                                year="2-digit"
                            />
                            { `  ` }
                            <FormattedTime
                                value={ new Date(end_time) }
                            />
                        </Typography>
                        <Typography color="textPrimary">
                            { location.title }
                        </Typography>
                    </Card>
                </ListItem>
            </Link>
        </NextLink>
    );
};

export default EventListItem;
