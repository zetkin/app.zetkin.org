import makeStyles from '@mui/styles/makeStyles';
import NextLink from 'next/link';
import {
  AccessTime,
  ArrowForward,
  EmojiPeople,
  FaceOutlined,
  MailOutlined,
  People,
  PlaceOutlined,
} from '@mui/icons-material';
import { Box, Button, Checkbox, Link, Theme, Typography } from '@mui/material';

import { EventState } from '../../models/EventDataModel';
import messageIds from '../../l10n/messageIds';
import { STATUS_COLORS } from '../../../campaigns/components/ActivityList/items/ActivityListItem';
import { useMessages } from 'core/i18n';
import ZUIEllipsisMenu from '../../../../zui/ZUIEllipsisMenu';
import ZUIPerson from '../../../../zui/ZUIPerson';
import ZUITimeSpan from '../../../../zui/ZUITimeSpan';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from '../../../../utils/types/zetkin';

interface StyleProps {
  color: STATUS_COLORS;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  description: {
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 3,
    display: '-webkit-box',
    maxHeight: '100%',
    overflow: 'hidden',
    whiteSpace: 'normal',
    width: '100%',
  },
  dot: {
    backgroundColor: ({ color }) => theme.palette.statusColors[color],
    borderRadius: '100%',
    height: '10px',
    marginLeft: '0.5em',
    marginRight: '0.5em',
    width: '10px',
  },
}));

interface EventPopperProps {
  event: ZetkinEvent;
  onCancel: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onDelete: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onPublish: () => void;
  participants: ZetkinEventParticipant[];
  respondents: ZetkinEventResponse[];
  state: EventState;
}

const EventPopper = ({
  event,
  onPublish,
  onCancel,
  onDelete,
  state,
  respondents,
  participants,
}: EventPopperProps) => {
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
  const messages = useMessages(messageIds);
  const remindedParticipants =
    participants?.filter((p) => p.reminder_sent != null).length ?? 0;
  const availParticipants = participants?.length ?? 0;
  const signedParticipants =
    respondents?.filter((r) => !participants?.some((p) => p.id === r.id))
      .length ?? 0;
  return (
    <Box display="flex" flexDirection="column">
      <Box alignItems="center" display="flex">
        <Checkbox size="medium" />
        <Typography variant="h5">
          {event.title || event.activity.title}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex">
        <Box className={classes.dot} />{' '}
        <Typography color="secondary">{event.activity.title}</Typography>
      </Box>
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <Box alignItems="center" display="flex">
            <People color="secondary" sx={{ paddingRight: 1 }} />
            <Typography color="secondary" variant="body2">
              {messages.eventPopper.booked().toUpperCase()}
            </Typography>
          </Box>
          <Typography color="secondary">{`${event.num_participants_available}/${event.num_participants_required}`}</Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box alignItems="center" display="flex">
            <MailOutlined color="secondary" sx={{ paddingRight: 1 }} />
            <Typography color="secondary" variant="body2">
              {messages.eventPopper.notified().toUpperCase()}
            </Typography>
          </Box>
          <Typography color="secondary">{`${remindedParticipants}/${availParticipants}`}</Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box alignItems="center" display="flex">
            <EmojiPeople color="secondary" sx={{ paddingRight: 1 }} />
            <Typography color="secondary" variant="body2">
              {messages.eventPopper.signups().toUpperCase()}
            </Typography>
          </Box>
          <Typography color="secondary">{signedParticipants}</Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box alignItems="center" display="flex">
          <AccessTime color="secondary" sx={{ paddingRight: 1 }} />
          <Typography color="secondary" variant="body2">
            {messages.eventPopper.dateAndTime().toUpperCase()}
          </Typography>
        </Box>
        <Typography color="secondary">
          <ZUITimeSpan
            end={new Date(event.end_time)}
            start={new Date(event.start_time)}
          />
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column">
        <Box alignItems="center" display="flex">
          <PlaceOutlined color="secondary" sx={{ paddingRight: 1 }} />
          <Typography color="secondary" variant="body2">
            {messages.eventPopper.location().toUpperCase()}
          </Typography>
        </Box>
        <Typography color="secondary">{event.location.title}</Typography>
      </Box>

      <Box display="flex" flexDirection="column">
        <Box alignItems="center" display="flex">
          <FaceOutlined color="secondary" sx={{ paddingRight: 1 }} />
          <Typography color="secondary" variant="body2">
            {messages.eventPopper.contactPerson().toUpperCase()}
          </Typography>
        </Box>
        {event.contact ? (
          <ZUIPerson id={event.contact.id} name={event.contact.name} />
        ) : (
          <Typography color="secondary" fontStyle="italic">
            {messages.eventPopper.noContact()}
          </Typography>
        )}
      </Box>
      {event.info_text && (
        <Box display="flex" flexDirection="column">
          <Typography color="secondary" variant="body2">
            {messages.eventPopper.description().toUpperCase()}
          </Typography>
          <Box className={classes.description}>
            <Typography color="secondary">{event.info_text}</Typography>
          </Box>
        </Box>
      )}
      <Box alignItems="center" display="flex" justifyContent="flex-end">
        <NextLink
          href={`/organize/${event.organization.id}/${
            event.campaign ? `projects/${event.campaign.id}` : 'standalone'
          }/${event.id}`}
          passHref
        >
          <Link underline="none">
            <Box display="flex">
              <Typography sx={{ paddingRight: 1 }}>
                {messages.eventPopper.eventPageLink().toUpperCase()}
              </Typography>
              <ArrowForward color="primary" />
            </Box>
          </Link>
        </NextLink>
      </Box>
      <Box alignItems="center" display="flex" justifyContent="flex-end">
        <Button onClick={onPublish} variant="contained">
          {messages.eventPopper.publish()}
        </Button>
        <ZUIEllipsisMenu
          items={[
            { label: 'Delete', onSelect: onDelete },
            { label: 'Cancel', onSelect: onCancel },
          ]}
        />
      </Box>
    </Box>
  );
};
export default EventPopper;
