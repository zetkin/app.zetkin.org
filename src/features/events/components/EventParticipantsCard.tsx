import NextLink from 'next/link';
import { Settings } from '@mui/icons-material';
import {
  Avatar,
  Box,
  ClickAwayListener,
  Divider,
  Link,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import getEventUrl from '../utils/getEventUrl';
import { getParticipantsStatusColor } from '../utils/eventUtils';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import useEvent from '../hooks/useEvent';
import useEventParticipants from '../hooks/useEventParticipants';
import useEventParticipantsMutations from '../hooks/useEventParticipantsMutations';
import { useMessages } from 'core/i18n';
import ZUICard from 'zui/ZUICard';
import ZUINumberChip from 'zui/ZUINumberChip';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

type EventParticipantsCardProps = {
  eventId: number;
  orgId: number;
};

const EventParticipantsCard: FC<EventParticipantsCardProps> = ({
  eventId,
  orgId,
}) => {
  const eventData = useEvent(orgId, eventId).data;
  const { pendingSignUps, participantsFuture } = useEventParticipants(
    orgId,
    eventId
  );
  const participants = participantsFuture.data || [];

  const { setReqParticipants } = useEventParticipantsMutations(orgId, eventId);
  const messages = useMessages(messageIds);

  const remindedParticipants =
    participants.filter((p) => p.reminder_sent != null && !p.cancelled)
      .length ?? 0;

  const availParticipants = eventData?.num_participants_available ?? 0;
  const reqParticipants = eventData?.num_participants_required ?? 0;

  const [newReqParticipants, setNewReqParticipants] = useState<number | null>(
    reqParticipants
  );
  const [anchorEl, setAnchorEl] = useState<
    null | (EventTarget & SVGSVGElement)
  >(null);

  if (!eventData) {
    return null;
  }

  return (
    <Box>
      <ZUICard
        header={messages.eventParticipantsCard.header()}
        status={
          <Box display="flex">
            <ZUINumberChip
              color={getParticipantsStatusColor(
                reqParticipants,
                availParticipants
              )}
              outlined={true}
              size="sm"
              value={`${availParticipants}/${reqParticipants}`}
            />
            <Box ml={1}>
              <Settings
                color="secondary"
                cursor="pointer"
                onClick={(event) =>
                  setAnchorEl(anchorEl ? null : event.currentTarget)
                }
              />
            </Box>
            <Popper anchorEl={anchorEl} open={!!anchorEl}>
              <ClickAwayListener
                onClickAway={() => {
                  setAnchorEl(null);
                  if (
                    newReqParticipants != null &&
                    newReqParticipants != reqParticipants
                  ) {
                    setReqParticipants(newReqParticipants);
                  }
                }}
              >
                <Paper elevation={3} variant="elevation">
                  <Box mt={1} p={2}>
                    <TextField
                      helperText={messages.eventParticipantsCard.reqParticipantsHelperText()}
                      label={messages.eventParticipantsCard.reqParticipantsLabel()}
                      onChange={(ev) => {
                        const val = ev.target.value;

                        if (val == '') {
                          setNewReqParticipants(null);
                          return;
                        }

                        const intVal = parseInt(val);
                        if (!isNaN(intVal) && intVal.toString() == val) {
                          setNewReqParticipants(intVal);
                        }
                      }}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                          setAnchorEl(null);
                          if (newReqParticipants != null) {
                            setReqParticipants(newReqParticipants);
                          }
                        } else if (ev.key === 'Escape') {
                          setAnchorEl(null);
                          setNewReqParticipants(reqParticipants);
                        }
                      }}
                      value={
                        newReqParticipants === null ? '' : newReqParticipants
                      }
                      variant="outlined"
                    />
                  </Box>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </Box>
        }
      >
        <Divider />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            marginY={1}
          >
            <Typography color={'secondary'} component="h6" variant="subtitle1">
              {messages.eventParticipantsCard.pending()}
            </Typography>
            <Typography>{pendingSignUps.length}</Typography>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            marginBottom={1}
          >
            <Typography color={'secondary'} component="h6" variant="subtitle1">
              {messages.eventParticipantsCard.notifications()}
            </Typography>
            <Typography>{`${remindedParticipants}/${availParticipants}`}</Typography>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            marginBottom={1}
          >
            <Typography color={'secondary'} component="h6" variant="subtitle1">
              {messages.eventParticipantsCard.contact()}
            </Typography>
            {eventData.contact && (
              <Box alignItems="center" display="flex">
                <ZUIPersonHoverCard personId={eventData.contact.id}>
                  <Avatar
                    src={`/api/orgs/${eventData.organization.id}/people/${eventData.contact.id}/avatar`}
                    style={{ height: 30, marginRight: 10, width: 30 }}
                  />
                  {eventData.contact.name}
                </ZUIPersonHoverCard>
              </Box>
            )}
            {!eventData.contact && (
              <Typography>
                {messages.eventParticipantsCard.noContact()}
              </Typography>
            )}
          </Box>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="center" marginTop={2}>
          <NextLink
            href={`${getEventUrl(eventData)}/participants`}
            legacyBehavior
            passHref
          >
            <Link underline="none">
              <Typography
                color={theme.palette.info.main}
                component="h6"
                variant="subtitle1"
              >
                {messages.eventParticipantsCard.participantList().toUpperCase()}
              </Typography>
            </Link>
          </NextLink>
        </Box>
      </ZUICard>
    </Box>
  );
};

export default EventParticipantsCard;
