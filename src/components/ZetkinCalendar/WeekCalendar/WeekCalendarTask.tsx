import { getContrastColor } from 'utils/colorUtils';
import { grey } from '@material-ui/core/colors';
import NextLink from 'next/link';
import { useState } from 'react';
import { Box, Link, Typography } from '@material-ui/core';

import { ZetkinCampaign, ZetkinTask } from 'types/zetkin';

const DEFAULT_COLOR = grey[900];

interface WeekCalendarTaskProps {
  baseHref: string;
  campaign?: ZetkinCampaign;
  task: ZetkinTask;
}

const WeekCalendarTask = ({
  baseHref,
  campaign,
  task,
}: WeekCalendarTaskProps): JSX.Element => {
  const [focused, setFocused] = useState(false);

  return (
    <li style={{ listStyle: 'none', width: '100%' }}>
      <NextLink href={baseHref + `/tasks/${task.id}`} passHref>
        <Link underline="none">
          <Box
            alignItems="center"
            bgcolor={
              (campaign?.color || DEFAULT_COLOR) + `${focused ? '' : '55'}`
            }
            color={getContrastColor(campaign?.color || DEFAULT_COLOR)}
            data-testid={`task-${task.id}`}
            display="flex"
            mb={0.5}
            onMouseEnter={() => setFocused(true)}
            onMouseLeave={() => setFocused(false)}
            px={0.5}
            width={1}
          >
            <Typography data-testid={`task-${task.id}`} noWrap variant="body2">
              {task.title}
            </Typography>
          </Box>
        </Link>
      </NextLink>
    </li>
  );
};

export default WeekCalendarTask;
