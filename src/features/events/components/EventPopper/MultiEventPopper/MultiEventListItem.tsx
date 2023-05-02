import { FC } from 'react';
import { useIntl } from 'react-intl';
import { WarningSlot } from '../../EventWarningIcons';
import { Box, Checkbox, Typography } from '@mui/material';
import {
  ChevronRightOutlined,
  EmojiPeople,
  FaceRetouchingOff,
  MailOutline,
  People,
} from '@mui/icons-material';

import EventDataModel from 'features/events/models/EventDataModel';
import LocationName from '../../LocationName';
import messageIds from 'features/events/l10n/messageIds';
import StatusDot from '../StatusDot';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIIconLabel from 'zui/ZUIIconLabel';

export enum CLUSTER_TYPE {
  ARBITRARY = 'arbitrary',
  LOCATION = 'location',
  SHIFT = 'shift',
}

interface MultiEventListItemProps {
  clusterType: CLUSTER_TYPE;
  compact: boolean;
  event: ZetkinEvent;
  onEventClick: (id: number) => void;
}

const MultiEventListItem: FC<MultiEventListItemProps> = ({
  clusterType,
  compact,
  event,
  onEventClick,
}) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);
  const model = useModel(
    (env) => new EventDataModel(env, event.organization.id, event.id)
  );

  const participants = model.getParticipants().data || [];
  const state = model.state;

  const warningIcons: (JSX.Element | null)[] = [null, null, null];

  if (!event.contact) {
    warningIcons[0] = (
      <WarningSlot
        key="contact"
        icon={<FaceRetouchingOff color="error" fontSize="small" />}
        tooltip={messages.eventPopper.noContact()}
      />
    );
  }

  const numBooked = participants.length;
  if (event.num_participants_available > numBooked) {
    warningIcons[1] = (
      <WarningSlot
        key="signups"
        icon={<EmojiPeople color="error" fontSize="small" />}
        tooltip={messages.eventPopper.pendingSignups()}
      />
    );
  }

  const reminded = participants.filter((p) => !!p.reminder_sent);
  const numReminded = reminded.length;
  if (numReminded < participants.length) {
    warningIcons[2] = (
      <WarningSlot
        key="reminders"
        icon={<MailOutline color="error" fontSize="small" />}
        tooltip={messages.eventPopper.unsentReminders({
          numMissing: participants.length - numReminded,
        })}
      />
    );
  }

  const timeSpan = `${intl.formatTime(event.start_time)}-${intl.formatTime(
    event.end_time
  )}`;

  return (
    <Box display="flex" flexDirection="column" paddingBottom={1} width="100%">
      <Box display="flex">
        <Checkbox sx={{ padding: '0px' }} />
        <Box
          display="flex"
          flexGrow={1}
          justifyContent="space-between"
          onClick={() => onEventClick(event.id)}
          sx={{ cursor: 'pointer' }}
        >
          <Box maxWidth="220px">
            <Typography
              paddingLeft={1}
              sx={{
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {clusterType == CLUSTER_TYPE.LOCATION && (
                <LocationName location={event.location} />
              )}
              {clusterType == CLUSTER_TYPE.SHIFT && timeSpan}
              {clusterType == CLUSTER_TYPE.ARBITRARY &&
                (event.title || event.activity.title)}
            </Typography>
          </Box>
          <Box alignItems="center" display="flex">
            <Box display="flex">
              {warningIcons.map((icon, idx) => {
                if (icon) {
                  return icon;
                }
                if (!compact) {
                  return <WarningSlot key={idx} />;
                }
              })}
            </Box>
            <Box paddingRight={2}>
              <ZUIIconLabel
                color={
                  event.num_participants_available <
                  event.num_participants_required
                    ? 'error'
                    : 'secondary'
                }
                icon={
                  <People
                    color={
                      event.num_participants_available <
                      event.num_participants_required
                        ? 'error'
                        : 'secondary'
                    }
                    fontSize="small"
                  />
                }
                label={`${event.num_participants_available}/${event.num_participants_required}`}
                size="sm"
              />
            </Box>
            <ChevronRightOutlined />
          </Box>
        </Box>
      </Box>
      {clusterType === CLUSTER_TYPE.ARBITRARY && (
        <Box display="flex" paddingLeft={3}>
          <Box paddingTop={0.6}>
            <StatusDot state={state} />
          </Box>
          <Typography color="secondary" variant="body2">
            {`${timeSpan}, `}
            <LocationName location={event.location} />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MultiEventListItem;
