import { FormattedTime } from 'react-intl';
import { getContrastColor } from '../../../utils/colorUtils';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
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

    const startsBeforeToday = startTime <= startOfDay;

    return (
        <li key={ event.id }>
            <NextLink href={  baseHref + `/calendar/events/${event.id}` } passHref>
                <Link underline="none">
                    <Box
                        { ...( index === 0 && { ref: listItem } ) }
                        bgcolor={ campaign?.color || DEFAULT_COLOR }
                        color={ getContrastColor(campaign?.color || DEFAULT_COLOR) }
                        data-testid={ `event-${event.id}` }
                        display={ isVisible ? 'block' : 'none' }
                        mt={ 0.5 }
                        px={ 0.5 }
                        width={ 1 }>
                        <Typography noWrap={ true } variant="body2">
                            <FormattedTime value={ new Date(startsBeforeToday? startOfDay: startTime) }/>{ ` - ` }
                            { event.title || event.activity.title }
                        </Typography>
                    </Box>
                </Link>
            </NextLink>
        </li>
    );
};


export default MonthCalendarEvent;
