import Link from 'next/link';
import { ListItem, ListItemText, Typography } from '@material-ui/core';

import { removeOffset } from 'utils/dateUtils';
import ZetkinDateTime from 'components/ZetkinDateTime';
import { ZetkinEvent } from 'types/zetkin';

interface EventListItemProps {
    event: ZetkinEvent;
    hrefBase: string;
}

const EventListItem = ({ event, hrefBase }: EventListItemProps): JSX.Element => {
    const { id, title, activity, location, start_time, end_time } = event;

    return (
        <Link href={ hrefBase + `/calendar/events/${id}` } passHref>
            <ListItem button component="a">
                <ListItemText>
                    <Typography component="h5" variant="body1">
                        { title || activity.title }
                    </Typography>
                    <Typography color="textPrimary" variant="body2">
                        <ZetkinDateTime
                            datetime={ removeOffset(start_time) }
                        />
                        { ` - ` }
                        <ZetkinDateTime
                            datetime={ removeOffset(end_time) }
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
