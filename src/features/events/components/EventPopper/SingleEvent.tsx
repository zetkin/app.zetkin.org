import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { useMessages } from 'core/i18n';
import { useRouter } from 'next/router';
import {
  AccessTime,
  ArrowForward,
  EmojiPeople,
  FaceOutlined,
  MailOutline,
  People,
  PlaceOutlined,
} from '@mui/icons-material';
import { Box, Button, Link, Typography } from '@mui/material';
import { FC, useContext } from 'react';

import EventSelectionCheckBox from '../EventSelectionCheckBox';
import getEventUrl from 'features/events/utils/getEventUrl';
import LocationLabel from '../LocationLabel';
import messageIds from 'features/events/l10n/messageIds';
import Quota from './Quota';
import { removeOffset } from 'utils/dateUtils';
import StatusDot from './StatusDot';
import useModel from 'core/useModel';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import EventDataModel, {
  EventState,
} from 'features/events/models/EventDataModel';

const useStyles = makeStyles(() => ({
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

interface SingleEventProps {
  event: ZetkinEvent;
  onClickAway: () => void;
}

const SingleEvent: FC<SingleEventProps> = ({ event, onClickAway }) => {
  const router = useRouter();
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const messages = useMessages(messageIds);
  const classes = useStyles();

  const model = useModel(
    (env) => new EventDataModel(env, event.organization.id, event.id)
  );

  const participants = model.getParticipants().data || [];
  const respondents = model.getRespondents().data || [];
  const state = model.state;

  const showPublishButton =
    state == EventState.DRAFT ||
    state == EventState.SCHEDULED ||
    state == EventState.CANCELLED;

  const remindedParticipants =
    participants.filter((p) => p.reminder_sent != null).length ?? 0;
  const availableParticipants =
    participants.filter((p) => p.cancelled !== null).length ?? 0;
  const signedParticipants =
    respondents.filter((r) => !participants.some((p) => p.id === r.id))
      .length ?? 0;

  const ellipsisMenuItems = [
    {
      label: messages.eventPopper.delete(),
      onSelect: () =>
        showConfirmDialog({
          onSubmit: () => {
            model.deleteEvent();
            onClickAway();
            router.push(
              `/organize/${event.organization.id}${
                event.campaign ? `/projects/${event.campaign.id}` : ''
              }`
            );
          },
          title: messages.eventPopper.confirmDelete(),
          warningText: messages.eventPopper.deleteWarning(),
        }),
    },
  ];
  if (state !== EventState.CANCELLED) {
    ellipsisMenuItems.push({
      label: messages.eventPopper.cancel(),
      onSelect: () =>
        showConfirmDialog({
          onSubmit: () => {
            model.cancel();
            onClickAway();
          },
          title: messages.eventPopper.confirmCancel(),
          warningText: messages.eventPopper.cancelWarning(),
        }),
    });
  }

  return (
    <>
      <Box alignItems="center" display="flex">
        <EventSelectionCheckBox eventList={[event]} />
        <Typography sx={{ pl: 1 }} variant="h5">
          {event.title || event.activity?.title || messages.common.noTitle()}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex">
        <StatusDot state={state} />
        <Typography color="secondary" sx={{ ml: 1 }}>
          {event.activity?.title || messages.common.noActivity()}
        </Typography>
      </Box>
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
                <MailOutline color="secondary" sx={{ fontSize: '1.3rem' }} />
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
        <Typography color="secondary" variant="body2">
          <ZUITimeSpan
            end={new Date(removeOffset(event.end_time))}
            start={new Date(removeOffset(event.start_time))}
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
        <Typography color="secondary" variant="body2">
          <LocationLabel location={event.location} />
        </Typography>
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
          <Typography color="secondary" fontStyle="italic" variant="body2">
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
            <Typography color="secondary" variant="body2">
              {event.info_text}
            </Typography>
          </Box>
        </Box>
      )}
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-end"
        marginBottom={2}
      >
        <NextLink href={getEventUrl(event)} passHref>
          <Link underline="none">
            <Button
              endIcon={<ArrowForward />}
              onClick={onClickAway}
              variant="text"
            >
              {messages.eventPopper.eventPageLink().toUpperCase()}
            </Button>
          </Link>
        </NextLink>
      </Box>
      <Box alignItems="center" display="flex" justifyContent="flex-end">
        {showPublishButton && (
          <Button
            onClick={() => {
              model.publish();
              onClickAway();
            }}
            variant="contained"
          >
            {messages.eventPopper.publish()}
          </Button>
        )}
        <ZUIEllipsisMenu items={ellipsisMenuItems} />
      </Box>
    </>
  );
};

export default SingleEvent;
