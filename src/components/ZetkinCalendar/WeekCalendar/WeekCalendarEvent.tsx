import { FormattedTime } from 'react-intl';
import { getContrastColor } from 'utils/colorUtils';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { Box,  Link, Tooltip, Typography } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import { ZetkinCampaign, ZetkinEvent } from 'types/zetkin';

const DEFAULT_COLOR = grey[900];

interface WeekCalendarEventProps {
    baseHref: string;
    campaign?: ZetkinCampaign;
    event: ZetkinEvent;
    startOfDay: Date;
    shiftValue: number;
}

const WeekCalendarEvent = ({ shiftValue, baseHref, startOfDay, campaign, event }: WeekCalendarEventProps): JSX.Element => {
    const label = useRef<HTMLParagraphElement>(null);
    const eventDiv = useRef<HTMLDivElement>(null);
    const [maxNoOfLabels, setMaxNoOfLabels] = useState(2);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        const labelHeight = (label.current?.offsetHeight || 0)  + 5;
        const eventDivHeight = eventDiv.current?.offsetHeight || 0;
        if (eventDivHeight < labelHeight * 2) {
            setMaxNoOfLabels(1);
        }
        if (eventDivHeight < labelHeight) {
            setMaxNoOfLabels(0);
        }
    }, []);

    startOfDay = new Date(startOfDay.getUTCFullYear(), startOfDay.getUTCMonth(), startOfDay.getUTCDate(), startOfDay.getUTCHours(), startOfDay.getUTCMinutes());

    const endOfDay = new Date(new Date(startOfDay)
        .setDate(startOfDay.getDate() + 1));

    const naiveStartDate = new Date(event.start_time);
    const naiveEndDate = new Date(event.end_time);

    const startTime = new Date(naiveStartDate.getUTCFullYear(), naiveStartDate.getUTCMonth(), naiveStartDate.getUTCDate(), naiveStartDate.getUTCHours(), naiveStartDate.getUTCMinutes());

    const endTime = new Date(naiveEndDate.getUTCFullYear(), naiveEndDate.getUTCMonth(), naiveEndDate.getUTCDate(), naiveEndDate.getUTCHours(), naiveEndDate.getUTCMinutes());

    const startsBeforeToday = startTime <= startOfDay;
    const endsAfterToday = endTime >= endOfDay;

    const getEventPos = () => {
        const oneMinute = 100 / 1440;

        const startFromMidnight = startsBeforeToday ? 0 : (startTime.getTime() - new Date(startTime).setHours(0, 0, 0, 0)) / 60000;

        const endFromMidnight = endsAfterToday ? 24 * 60 : (endTime.getTime() - new Date(endTime).setHours(0, 0, 0, 0)) / 60000;
        const diff = endFromMidnight - startFromMidnight;

        return {
            height: `calc(${diff * oneMinute}% - 2px)`,
            top: `${startFromMidnight * oneMinute}%`,
        };
    };

    const getEventTimeLabel = () => {
        return (
            <>
                <FormattedTime value={ new Date(startsBeforeToday? startOfDay: startTime) }/>{ ` - ` }
            </>
        );
    };

    return (
        <li>
            <NextLink href={  baseHref + `/calendar/events/${event.id}` } passHref>
                <Link>
                    <Tooltip arrow placement="left" title={ event.title || event.activity.title }>
                        <Box
                            { ...{ ref: eventDiv } }
                            { ...( focused && { zIndex: 10 } ) }
                            bgcolor={ (campaign?.color
                                || DEFAULT_COLOR) + `${focused? '': '55'}` }
                            borderLeft={ `5px solid ${campaign?.color || DEFAULT_COLOR}` }
                            color={ getContrastColor(campaign?.color || DEFAULT_COLOR) }
                            data-testid={ `event-${event.id}` }
                            height={ getEventPos().height }
                            onMouseEnter={ () => setFocused(true) }
                            onMouseLeave={ () => setFocused(false) }
                            padding={ 1 }
                            position="absolute"
                            right={ 0 }
                            top={ getEventPos().top }
                            width={ `${100 - 5 * (shiftValue || 0)}%` }>
                            { maxNoOfLabels > 0 && (
                                <Typography ref={ label } noWrap variant="body2">
                                    <span data-testid={ `start-time-${event.id}` }>{ getEventTimeLabel() }</span>
                                    <span data-testid={ `title-${event.id}` }>{ event.title || event.activity.title }</span>
                                </Typography>) }
                            { maxNoOfLabels > 1 && event.location.title && (
                                <Typography data-testid={ `location-${event.id}` } noWrap variant="body2">
                                    { event.location.title }
                                </Typography>) }
                        </Box>
                    </Tooltip>
                </Link>
            </NextLink>
        </li>
    );
};


export default WeekCalendarEvent;
