import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Theme, Tooltip, Typography, useTheme } from '@mui/material';
import { Group, PlaceOutlined, ScheduleOutlined } from '@mui/icons-material';

import { EventState } from 'features/events/hooks/useEventState';
import getEventState from 'features/events/utils/getEventState';
import getStatusDotLabel from 'features/events/utils/getStatusDotLabel';
import messageIds from 'features/events/l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import { STATUS_COLORS } from 'features/campaigns/components/ActivityList/items/ActivityListItem';
import useEvent from 'features/events/hooks/useEvent';
import useEventParticipantsWithChanges from 'features/events/hooks/useEventParticipantsWithChanges';
import { useMessages } from 'core/i18n';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUIIconLabelRow from 'zui/ZUIIconLabelRow';
import ZUITimeSpan from 'zui/ZUITimeSpan';

interface StyleProps {
  color: STATUS_COLORS;
  selected: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  container: {
    alignItems: 'center',
    backgroundColor: ({ selected }) =>
      selected ? theme.palette.grey[100] : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.0em 0.5em',
  },
  dot: {
    backgroundColor: ({ color }) => theme.palette.statusColors[color],
    borderRadius: '100%',
    flexShrink: 0,
    height: '10px',
    marginLeft: '0.5em',
    marginRight: '0.5em',
    width: '10px',
  },
  endNumber: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    width: '7em',
  },
  left: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 0',
  },
  primaryIcon: {
    color: theme.palette.grey[500],
    fontSize: '28px',
  },
}));

type Props = {
  eventId: number;
  onSelect: () => void;
  orgId: number;
  selected: boolean;
};

const EventListsItem: FC<Props> = ({ eventId, onSelect, orgId, selected }) => {
  const event = useEvent(orgId, eventId)?.data;
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const { numParticipantsAvailable, numParticipantsRequired } =
    useEventParticipantsWithChanges(orgId, eventId);

  const status = event ? getEventState(event) : EventState.UNKNOWN;

  let color = STATUS_COLORS.GRAY;
  if (status === EventState.OPEN) {
    color = STATUS_COLORS.GREEN;
  } else if (status === EventState.ENDED) {
    color = STATUS_COLORS.RED;
  } else if (status === EventState.SCHEDULED) {
    color = STATUS_COLORS.BLUE;
  } else if (status === EventState.CANCELLED) {
    color = STATUS_COLORS.ORANGE;
  }
  const classes = useStyles({ color, selected });

  if (!event) {
    return null;
  }

  const title =
    event.title || event.activity?.title || messages.common.noTitle();

  const endNumberColor =
    numParticipantsAvailable < numParticipantsRequired ? 'error' : undefined;

  return (
    <Box
      className={classes.container}
      onClick={() => {
        onSelect();
      }}
    >
      <Box className={classes.left}>
        <Tooltip title={getStatusDotLabel({ color })}>
          <Box className={classes.dot} />
        </Tooltip>
        <Box>
          <Typography color={theme.palette.text.primary}>{title}</Typography>
          <Box>
            <Typography variant="body2">
              <ZUIIconLabelRow
                color="secondary"
                iconLabels={[
                  {
                    icon: (
                      <ScheduleOutlined color="secondary" fontSize="inherit" />
                    ),
                    label: (
                      <ZUITimeSpan
                        end={new Date(removeOffset(event.end_time))}
                        start={new Date(removeOffset(event.start_time))}
                      />
                    ),
                  },
                  ...(event.location
                    ? [
                        {
                          icon: (
                            <PlaceOutlined
                              color="secondary"
                              fontSize="inherit"
                            />
                          ),
                          label: event.location.title,
                        },
                      ]
                    : []),
                ]}
                size="sm"
              />
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Box className={classes.endNumber}>
          <ZUIIconLabel
            color={endNumberColor}
            icon={<Group color={endNumberColor} />}
            label={`${numParticipantsAvailable} / ${numParticipantsRequired}`}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EventListsItem;
