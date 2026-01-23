import { Box, Tooltip } from '@mui/material';

import { EventState } from 'features/events/hooks/useEventState';
import getStatusDotLabel from 'features/events/utils/getStatusDotLabel';
import { STATUS_COLORS } from 'features/campaigns/components/ActivitiesOverview/items/OverviewListItem';
import oldTheme from 'theme';

interface DotProps {
  state: EventState;
}

const StatusDot = ({ state }: DotProps) => {
  let color = STATUS_COLORS.GREY;
  if (state === EventState.OPEN) {
    color = STATUS_COLORS.GREEN;
  } else if (state === EventState.ENDED) {
    color = STATUS_COLORS.RED;
  } else if (state === EventState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (state === EventState.CANCELLED) {
    color = STATUS_COLORS.ORANGE;
  }

  return (
    <Tooltip title={getStatusDotLabel({ state })}>
      <Box
        sx={{
          backgroundColor: oldTheme.palette.statusColors[color],
          borderRadius: '100%',
          height: '10px',
          marginLeft: '0.5em',
          marginRight: '0.5em',
          width: '10px',
        }}
      />
    </Tooltip>
  );
};

export default StatusDot;
