import { FormattedTime } from 'react-intl';
import { getContrastColor } from '../../../utils/colorUtils';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { Box,  Link, Typography } from '@material-ui/core';
import { useEffect, useRef } from 'react';

import { getNaiveDate } from '../../../utils/getNaiveDate';
import { ZetkinCampaign, ZetkinEvent } from '../../../types/zetkin';

const DEFAULT_COLOR = grey[900];

interface MonthCalendarEventProps {
    baseHref: string;
    isVisible: boolean;
    campaign?: ZetkinCampaign;
    event: ZetkinEvent;
    startOfDay: Date;
    index: number;
    onLoad: (listItemHeight: number) => void;
}

const MonthCalendarEvent = ({ baseHref, index, startOfDay, campaign, event, onLoad, isVisible }: MonthCalendarEventProps): JSX.Element => {
    const listItem = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listItem.current) {
            const listItemHeight = listItem.current.offsetHeight || 0 * 1.5;
            onLoad(listItemHeight);
        }
    }, [onLoad]);

    const startTime = getNaiveDate(event.start_time);
    const endTime = getNaiveDate(event.end_time);

    const endOfDay = new Date(new Date(startOfDay)
        .setDate(startOfDay.getDate() + 1));

    const startsBeforeToday = startTime <= startOfDay;
    const endsAfterToday = endTime >= endOfDay;

    return (
        <li key={ event.id }>
            <NextLink href={  baseHref + `/calendar/events/${event.id}` } passHref>
                <Link underline="none">
                    <Box
                        { ...( index === 0 && { ref: listItem } ) }
                        alignItems="center"
                        bgcolor={ campaign?.color || DEFAULT_COLOR }
                        color={ getContrastColor(campaign?.color || DEFAULT_COLOR) }
                        data-testid={ `event-${event.id}` }
                        display={ isVisible ? 'flex' : 'none' }
                        mt={ 0.5 }
                        px={ 0.5 }
                        width={ 1 }>
                        { startsBeforeToday && <ArrowBackIos fontSize="inherit"/> }
                        <Typography noWrap={ true } variant="body2">
                            <FormattedTime value={ new Date(startsBeforeToday? startOfDay: startTime) }/>{ ` - ` }
                            { event.title || event.activity.title }
                        </Typography>
                        { endsAfterToday && <ArrowForwardIos fontSize="inherit"/> }
                    </Box>
                </Link>
            </NextLink>
        </li>
    );
};


export default MonthCalendarEvent;
