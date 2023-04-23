import makeStyles from '@mui/styles/makeStyles';
import NextLink from 'next/link';
import React from 'react';
import {
  AccessTime,
  ArrowForward,
  EmojiPeople,
  FaceOutlined,
  MailOutlined,
  People,
  PlaceOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Link,
  Paper,
  Popper,
  Theme,
  Typography,
} from '@mui/material';

import { EventState } from '../../models/EventDataModel';
import messageIds from '../../l10n/messageIds';
import { STATUS_COLORS } from '../../../campaigns/components/ActivityList/items/ActivityListItem';
import { useMessages } from 'core/i18n';
import ZUIEllipsisMenu from '../../../../zui/ZUIEllipsisMenu';
import ZUIIconLabel from '../../../../zui/ZUIIconLabel';
import ZUIPerson from '../../../../zui/ZUIPerson';
import ZUIPersonHoverCard from '../../../../zui/ZUIPersonHoverCard';
import ZUITimeSpan from '../../../../zui/ZUITimeSpan';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from '../../../../utils/types/zetkin';

interface StyleProps {
  color: STATUS_COLORS;
}

const useStyles = makeStyles<Theme>(() => ({
  description: {
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 3,
    display: '-webkit-box',
    maxHeight: '100%',
    overflow: 'hidden',
    whiteSpace: 'normal',
    width: '100%',
  },
}));

interface QuotaParams {
  denominator: number;
  numerator: number;
}

const Quota = ({ numerator, denominator }: QuotaParams) => {
  return (
    <Typography
      color={denominator > numerator ? 'red' : 'secondary'}
    >{`${numerator}/${denominator}`}</Typography>
  );
};

const useDotStyles = makeStyles<Theme, StyleProps>((theme) => ({
  dot: {
    backgroundColor: ({ color }) => theme.palette.statusColors[color],
    borderRadius: '100%',
    height: '10px',
    marginLeft: '0.5em',
    marginRight: '0.5em',
    width: '10px',
  },
}));

interface DotParams {
  state: EventState;
}

const Dot = ({ state }: DotParams) => {
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
  const classes = useDotStyles({ color });
  return <Box className={classes.dot} />;
};

interface EventPopperHeaderParams {
  event: ZetkinEvent;
  state: EventState;
}

function EventPopperHeader({ event, state }: EventPopperHeaderParams) {
  return (
    <>
      <Box alignItems="center" display="flex">
        <Checkbox size="medium" />
        <Typography variant="h5">
          {event.title || event.activity.title}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex" sx={{ ml: 1 }}>
        <Dot state={state} />
        <Typography color="secondary" sx={{ ml: 1 }}>
          {event.activity.title}
        </Typography>
      </Box>
    </>
  );
}

interface EventPopperBasicProps {
  event: ZetkinEvent;
  onCancel: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onDelete: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onPublish: () => void;
  participants: ZetkinEventParticipant[];
  respondents: ZetkinEventResponse[];
  state: EventState;
}

function EventPopperBasic({
  event,
  onPublish,
  onCancel,
  onDelete,
  state,
  respondents,
  participants,
}: EventPopperBasicProps) {
  const messages = useMessages(messageIds);
  const classes = useStyles();
  const remindedParticipants =
    participants?.filter((p) => p.reminder_sent != null).length ?? 0;
  const availableParticipants = participants?.length ?? 0;
  const signedParticipants =
    respondents?.filter((r) => !participants?.some((p) => p.id === r.id))
      .length ?? 0;
  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <Box display="flex" flexDirection="column">
          <Box alignItems="center" display="flex">
            <ZUIIconLabel
              color="secondary"
              icon={<People color="secondary" sx={{ fontSize: '1.3rem' }} />}
              label={messages.eventPopper.booked().toUpperCase()}
              size="xs"
            />
          </Box>
          <Quota
            denominator={event.num_participants_required}
            numerator={event.num_participants_available}
          />
        </Box>
        <Box display="flex" flexDirection="column">
          <Box alignItems="center" display="flex">
            <ZUIIconLabel
              color="secondary"
              icon={
                <MailOutlined color="secondary" sx={{ fontSize: '1.3rem' }} />
              }
              label={messages.eventPopper.notified().toUpperCase()}
              size="xs"
            />
          </Box>
          <Quota
            denominator={availableParticipants}
            numerator={remindedParticipants}
          />
        </Box>
        <Box display="flex" flexDirection="column">
          <Box alignItems="center" display="flex">
            <ZUIIconLabel
              color="secondary"
              icon={
                <EmojiPeople color="secondary" sx={{ fontSize: '1.3rem' }} />
              }
              label={messages.eventPopper.signups().toUpperCase()}
              size="xs"
            />
          </Box>
          <Typography color={signedParticipants > 0 ? 'red' : 'secondary'}>
            {signedParticipants}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
        <Box sx={{ mb: 0.4 }}>
          <ZUIIconLabel
            color="secondary"
            icon={<AccessTime color="secondary" sx={{ fontSize: '1.3rem' }} />}
            label={messages.eventPopper.dateAndTime().toUpperCase()}
            size="xs"
          />
        </Box>
        <Typography color="secondary">
          <ZUITimeSpan
            end={new Date(event.end_time)}
            start={new Date(event.start_time)}
          />
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
        <Box sx={{ mb: 0.4 }}>
          <ZUIIconLabel
            color="secondary"
            icon={
              <PlaceOutlined color="secondary" sx={{ fontSize: '1.3rem' }} />
            }
            label={messages.eventPopper.location().toUpperCase()}
            size="xs"
          />
        </Box>
        <Typography color="secondary">{event.location.title}</Typography>
      </Box>

      <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
        <Box sx={{ mb: 0.4 }}>
          <ZUIIconLabel
            color="secondary"
            icon={
              <FaceOutlined color="secondary" sx={{ fontSize: '1.3rem' }} />
            }
            label={messages.eventPopper.contactPerson().toUpperCase()}
            size="xs"
          />
        </Box>
        {event.contact ? (
          <ZUIPersonHoverCard personId={event.contact.id}>
            <ZUIPerson
              id={event.contact.id}
              name={event.contact.name}
              size={20}
            />
          </ZUIPersonHoverCard>
        ) : (
          <Typography color="secondary" fontStyle="italic">
            {messages.eventPopper.noContact()}
          </Typography>
        )}
      </Box>
      {event.info_text && (
        <Box display="flex" flexDirection="column" sx={{ mb: 3 }}>
          <Typography color="secondary" fontSize="0.7em">
            {messages.eventPopper.description().toUpperCase()}
          </Typography>
          <Box className={classes.description}>
            <Typography color="secondary">{event.info_text}</Typography>
          </Box>
        </Box>
      )}
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-end"
        sx={{ mb: 4 }}
      >
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
        {state == EventState.DRAFT ||
          state == EventState.SCHEDULED ||
          (state == EventState.CANCELLED && (
            <Button onClick={onPublish} variant="contained">
              {messages.eventPopper.publish()}
            </Button>
          ))}
        <ZUIEllipsisMenu
          items={[
            { label: 'Delete', onSelect: onDelete },
            { label: 'Cancel', onSelect: onCancel },
          ]}
        />
      </Box>
    </>
  );
}

interface EventPopperProps {
  anchorEl: HTMLElement | null;
  event: ZetkinEvent;
  onCancel: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onDelete: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onPublish: () => void;
  open: boolean;
  participants: ZetkinEventParticipant[];
  respondents: ZetkinEventResponse[];
  state: EventState;
}

const EventPopper = (props: EventPopperProps) => {
  return (
    <Popper anchorEl={props.anchorEl} open={props.open} placement="bottom">
      <Paper sx={{ padding: 2, width: '340px' }}>
        <Box display="flex" flexDirection="column">
          <EventPopperHeader event={props.event} state={props.state} />
          <EventPopperBasic {...props} />
        </Box>
      </Paper>
    </Popper>
  );
};
export default EventPopper;
