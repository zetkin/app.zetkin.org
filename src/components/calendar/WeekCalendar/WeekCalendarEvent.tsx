import { getContrastColor } from '../../../utils/colorUtils';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { useRef } from 'react';
import { Box,  Link } from '@material-ui/core';
import { ZetkinCampaign, ZetkinEvent } from '../../../types/zetkin';

const DEFAULT_COLOR = grey[200];

interface WeekCalendarEventProps {
    baseHref: string;
    campaign?: ZetkinCampaign;
    event: ZetkinEvent;
    startOfDay: Date;
}

const WeekCalendarEvent = ({ baseHref, startOfDay, campaign, event }: WeekCalendarEventProps): JSX.Element => {
    const eventItem = useRef<HTMLDivElement>(null);

    const endOfDay = new Date(new Date(startOfDay)
        .setDate(startOfDay.getDate() + 1));

    const getEventPos = (start: string, end: string) => {
        const oneMinute = 100 / 1440;
        const startTime = new Date(start);
        const endTime = new Date(end);

        let startFromMidnight = (startTime.getTime() - new Date(startTime).setUTCHours(0, 0, 0, 0)) / 60000;

        if (startTime < startOfDay) {
            startFromMidnight = 0;
        }

        let endFromMidnight = (endTime.getTime() - new Date(endTime).setUTCHours(0, 0, 0, 0)) / 60000;

        if (endTime > endOfDay) {
            endFromMidnight = 24 * 60;
        }

        const diff = endFromMidnight - startFromMidnight;

        return {
            height: `calc(${diff * oneMinute}% - 2px)`,
            top: `${startFromMidnight * oneMinute}%`,
        };
    };

    return (
        <li>
            <NextLink href={  baseHref + `/calendar/events/${event.id}` } passHref>
                <Link>
                    <Box
                        { ...{ ref: eventItem } }
                        bgcolor={ (campaign?.color || DEFAULT_COLOR) + '88' }
                        borderLeft={ `5px solid ${campaign?.color || DEFAULT_COLOR}` }
                        color={ getContrastColor(campaign?.color|| grey[400]) }
                        data-testid={ `event-${event.id}` }
                        height={ getEventPos(event.start_time, event.end_time).height }
                        padding={ 1 }
                        position="absolute"
                        top={ getEventPos(event.start_time, event.end_time).top }
                        width={ 1 }>
                        { `event with id ${event.id} and campaign ${event.campaign.id}` }
                    </Box>
                </Link>
            </NextLink>
        </li>
    );
};


export default WeekCalendarEvent;
