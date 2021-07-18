import Link from 'next/link';
import { FormattedDate, FormattedTime } from 'react-intl';
import { ListItem, ListItemText, Typography } from '@material-ui/core';

import { getNaiveDate } from '../../../utils/getNaiveDate';
import { ZetkinEvent } from '../../../types/zetkin';

interface EventListItemProps {
    event: ZetkinEvent;
    hrefBase: string;
}

const EventListItem = ({ event, hrefBase }: EventListItemProps): JSX.Element => {
    const { id, title, activity, location, start_time, end_time } = event;

    const startTime = getNaiveDate(start_time);
    const endTime = getNaiveDate(end_time);

    return (
        <Link href={ hrefBase + `/events/${id}` } passHref>
            <ListItem button component="a">
                <ListItemText>
                    <Typography component="h5" variant="body1">
                        { title || activity.title }
                    </Typography>
                    <Typography color="textPrimary" variant="body2">
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
                    <Typography color="textPrimary" variant="body2">
                        { location.title }
                    </Typography>
                </ListItemText>
            </ListItem>
        </Link>
    );
};

export default EventListItem;
