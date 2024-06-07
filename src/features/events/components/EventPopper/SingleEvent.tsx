import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import {
  AccessTime,
  ArrowForward,
  EmojiPeople,
  FaceOutlined,
  MailOutline,
  People,
  PlaceOutlined,
} from '@mui/icons-material';
import { Avatar, Box, Button, Link, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { Msg, useMessages } from 'core/i18n';

import { eventsDeselected } from 'features/events/store';
import EventSelectionCheckBox from '../EventSelectionCheckBox';
import getEventUrl from 'features/events/utils/getEventUrl';
import LocationLabel from '../LocationLabel';
import messageIds from 'features/events/l10n/messageIds';
import { MultiDayEvent } from 'features/calendar/components/utils';
import Quota from './Quota';
import { removeOffset } from 'utils/dateUtils';
import StatusDot from './StatusDot';
import { useAppDispatch } from 'core/hooks';
import useDuplicateEvent from 'features/events/hooks/useDuplicateEvent';
import useEventMutations from 'features/events/hooks/useEventMutations';
import useEventParticipants from 'features/events/hooks/useEventParticipants';
import { ZetkinEvent } from 'utils/types/zetkin';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import ZUIIconLabel from 'zui/ZUIIconLabel';
import ZUIPerson from 'zui/ZUIPerson';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import useEventState, { EventState } from 'features/events/hooks/useEventState';

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
  event: ZetkinEvent | MultiDayEvent;
  onClickAway: () => void;
}

const SingleEvent: FC<SingleEventProps> = ({ event, onClickAway }) => {
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const messages = useMessages(messageIds);
  const classes = useStyles();
  const orgId = event.organization.id;
  const { participantsFuture, respondentsFuture } = useEventParticipants(
    event.organization.id,
    event.id
  );
  const { cancelEvent, deleteEvent, publishEvent } = useEventMutations(
    event.organization.id,
    event.id
  );
  const duplicateEvent = useDuplicateEvent(event.organization.id, event.id);

  const dispatch = useAppDispatch();
  const participants = participantsFuture.data || [];
  const respondents = respondentsFuture.data || [];
  const state = useEventState(event.organization.id, event.id);

  const showPublishButton =
    state == EventState.DRAFT ||
    state == EventState.SCHEDULED ||
    state == EventState.CANCELLED;

  const remindedParticipants =
    participants.filter((p) => p.reminder_sent != null && !p.cancelled)
      .length ?? 0;
  const availableParticipants =
    participants.filter((p) => !p.cancelled).length ?? 0;
  const signedParticipants =
    respondents.filter((r) => !participants.some((p) => p.id === r.id))
      .length ?? 0;

  const availableParticipantsList = participants.filter((p) => !p.cancelled);
  const maxAvailableParticipantsToDisplay: number = 25;
  const maxAvailableParticipantsToDisplayList = availableParticipantsList.slice(
    0,
    maxAvailableParticipantsToDisplay
  );

  const ellipsisMenuItems = [
    {
      label: messages.eventPopper.delete(),
      onSelect: () =>
        showConfirmDialog({
          onSubmit: () => {
            deleteEvent();
            dispatch(eventsDeselected([event]));
            onClickAway();
          },
          title: messages.eventPopper.confirmDelete(),
          warningText: messages.eventPopper.deleteWarning(),
        }),
    },
    {
      label: messages.eventPopper.duplicate(),
      onSelect: () => {
        duplicateEvent();
        onClickAway();
      },
    },
  ];
  if (state !== EventState.CANCELLED) {
    ellipsisMenuItems.push({
      label: messages.eventPopper.cancel(),
      onSelect: () =>
        showConfirmDialog({
          onSubmit: () => {
            cancelEvent();
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
        <EventSelectionCheckBox events={[event]} />
        <Typography sx={{ ml: 1 }} variant="h5">
          {event.title || event.activity?.title || messages.common.noTitle()}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex">
        <StatusDot state={state} />
        <Typography color="secondary" sx={{ ml: 1 }}>
          {event.activity?.title || messages.common.noActivity()}
        </Typography>
      </Box>
      {/* box: tid och datum */}
      <Box display="flex" flexDirection="column" sx={{ mb: 2, my: 2 }}>
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
            end={
              new Date(
                removeOffset(
                  'originalEndTime' in event
                    ? event.originalEndTime
                    : event.end_time
                )
              )
            }
            start={
              new Date(
                removeOffset(
                  'originalStartTime' in event
                    ? event.originalStartTime
                    : event.start_time
                )
              )
            }
          />
        </Typography>
      </Box>
      {/* box: plats */}
      <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
        {/* box: plats-ikon + text */}
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
        {/* plats */}
        <Typography color="secondary" variant="body2">
          <LocationLabel location={event.location} />
        </Typography>
      </Box>
      {/* box: bokade - påminda - anmälda*/}
      <Box display="flex" flexDirection="column" gap={1} sx={{ my: 2 }}>
        {/* box: anmälningar */}
        <Box alignItems="center" display="flex" justifyContent="space-between">
          {/* box: anmälningar-ikon + text */}
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
          {/* anmälda, antal */}
          <Typography color={signedParticipants > 0 ? 'red' : 'secondary'}>
            {signedParticipants}
          </Typography>
        </Box>
        {/* box: bokade */}
        <Box alignItems="center" display="flex" justifyContent="space-between">
          {/* box: bokade-ikon + text*/}
          <Box alignItems="center" display="flex">
            <ZUIIconLabel
              color="secondary"
              icon={<People color="secondary" sx={{ fontSize: '1.3rem' }} />}
              label={messages.eventPopper.booked().toUpperCase()}
              size="xs"
            />
          </Box>
          {/* bokade, antal*/}
          <Typography>{event.num_participants_available}</Typography>
        </Box>
        {availableParticipantsList.length > 0 && (
          <Box alignItems="center" display="flex" flexWrap="wrap" gap={0.5}>
            {maxAvailableParticipantsToDisplayList.map((p, index) => (
              <ZUIPersonHoverCard key={index} personId={p.id}>
                <Avatar
                  src={orgId ? `/api/orgs/${orgId}/people/${p.id}/avatar` : ''}
                  sx={{ height: 20, width: 20 }}
                />
              </ZUIPersonHoverCard>
            ))}
            {availableParticipantsList.length >
              maxAvailableParticipantsToDisplay && (
              <Box>
                <Typography color="secondary">
                  <Msg
                    id={messageIds.eventPopper.surplus}
                    values={{
                      numOthers:
                        availableParticipantsList.length -
                        maxAvailableParticipantsToDisplay,
                    }}
                  />
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {/* box: påminda */}
        <Box alignItems="center" display="flex" justifyContent="space-between">
          {/* box: påminda-ikon + text */}
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
          {/* påminda, antal */}
          <Quota
            denominator={availableParticipants}
            numerator={remindedParticipants}
          />
        </Box>
      </Box>
      {/* box: kontaktperson */}
      <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
        {/* box: kontaktperson-ikon + text */}
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
        {/* kontaktperson */}
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
      {/* beskrivning, om det finns */}
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
        <NextLink href={getEventUrl(event)} legacyBehavior passHref>
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
              publishEvent();
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
