import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/system';
import { Box, Tooltip } from '@mui/material';

import { EventState } from 'features/events/models/EventDataModel';
import getStatusDotLabel from 'features/events/utils/getStatusDotLabel';
import { STATUS_COLORS } from 'features/campaigns/components/ActivitiesOverview/items/OverviewListItem';

interface StyleProps {
  color: STATUS_COLORS;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  dot: {
    backgroundColor: ({ color }) => theme.palette.statusColors[color],
    borderRadius: '100%',
    height: '10px',
    marginLeft: '0.5em',
    marginRight: '0.5em',
    width: '10px',
  },
}));

interface DotProps {
  state: EventState;
}

const StatusDot = ({ state }: DotProps) => {
  let color = STATUS_COLORS.GRAY;
  if (state === EventState.OPEN) {
    color = STATUS_COLORS.GREEN;
  } else if (state === EventState.ENDED) {
    color = STATUS_COLORS.RED;
  } else if (state === EventState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (state === EventState.CANCELLED) {
    color = STATUS_COLORS.ORANGE;
  }
  const classes = useStyles({ color });

  return (
    <Tooltip title={getStatusDotLabel({ state })}>
      <Box className={classes.dot} />
    </Tooltip>
  );
};

export default StatusDot;
