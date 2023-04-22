import dayjs from 'dayjs';
import { FormattedTime } from 'react-intl';
import { getContrastColor } from 'utils/colorUtils';
import { grey } from '@mui/material/colors';
import NextLink from 'next/link';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { removeOffset } from 'utils/dateUtils';
import { ZetkinCampaign, ZetkinEvent } from 'utils/types/zetkin';

const DEFAULT_COLOR = grey[900];

interface MonthCalendarEventProps {
  baseHref: string;
  isVisible: boolean;
  campaign?: ZetkinCampaign;
  event: ZetkinEvent;
  startOfDay: Date;
  onLoad?: (listItemHeight: number) => void;
}

const MonthCalendarEvent = ({
  baseHref,
  startOfDay,
  campaign,
  event,
  onLoad,
  isVisible,
}: MonthCalendarEventProps): JSX.Element => {
  const eventDiv = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (eventDiv.current && onLoad) {
      const listItemHeight = eventDiv.current.offsetHeight || 0 * 1.5;
      onLoad(listItemHeight);
    }
  }, [onLoad]);

  const dayStart = dayjs(startOfDay);
  const dayEnd = dayStart.endOf('day');

  const eventStartTime = dayjs(removeOffset(event.start_time));
  const eventEndTime = dayjs(removeOffset(event.end_time));

  const startsBeforeToday = eventStartTime.isBefore(dayStart);
  const endsAfterToday = eventEndTime.isAfter(dayEnd);

  return (
    <li>
      <NextLink href={baseHref + `/events/${event.id}`} passHref>
        <Link underline="none">
          <Box
            onMouseEnter={() => setFocused(true)}
            onMouseLeave={() => setFocused(false)}
            {...{ ref: eventDiv }}
            alignItems="center"
            bgcolor={
              (campaign?.color || DEFAULT_COLOR) + `${focused ? '' : '55'}`
            }
            borderLeft={`5px solid ${campaign?.color || DEFAULT_COLOR}`}
            color={getContrastColor(campaign?.color || DEFAULT_COLOR)}
            data-testid={`event-${event.id}`}
            display={isVisible ? 'flex' : 'none'}
            mt={0.5}
            px={0.5}
            width={1}
          >
            {startsBeforeToday && (
              <ArrowBackIos
                data-testid={`back-icon-${event.id}`}
                fontSize="inherit"
              />
            )}
            <Typography
              data-testid={`start-time-${event.id}`}
              noWrap={true}
              variant="body2"
            >
              <FormattedTime
                value={
                  startsBeforeToday
                    ? dayStart.toDate()
                    : eventStartTime.toDate()
                }
              />
              {` - `}
              <span data-testid={`title-${event.id}`}>
                {event.title || event.activity.title}
              </span>
            </Typography>
            {endsAfterToday && (
              <ArrowForwardIos
                data-testid={`fwd-icon-${event.id}`}
                fontSize="inherit"
              />
            )}
          </Box>
        </Link>
      </NextLink>
    </li>
  );
};

export default MonthCalendarEvent;
