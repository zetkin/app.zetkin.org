import { createStyles } from '@material-ui/core/styles';
import NextLink from 'next/link';
import { Theme } from '@material-ui/core/styles';
import { Card, Link, ListItem, makeStyles, Typography } from '@material-ui/core';
import { FormattedDate, FormattedTime } from 'react-intl';

import { getNaiveDate } from '../../../utils/getNaiveDate';
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

    const startTime = getNaiveDate(start_time);
    const endTime = getNaiveDate(end_time);

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
                                day="numeric"
                                month="long"
                                value={ startTime }
                            />
                            { `  ` }
                            <FormattedTime
                                value={ startTime }
                            />
                            { ` - ` }
                            <FormattedDate
                                day="numeric"
                                month="long"
                                value={ endTime }
                            />
                            { `  ` }
                            <FormattedTime
                                value={ endTime }
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
