import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Check, Settings } from '@mui/icons-material';
import { FC, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import useEventData from '../hooks/useEventData';
import useEventParticipantsData from '../hooks/useEventParticipantsData';
import useEventParticipantsMutations from '../hooks/useEventParticipantsMutations';
import useParticipantStatus from '../hooks/useParticipantsStatus';
import ZUICard from 'zui/ZUICard';
import ZUINumberChip from 'zui/ZUINumberChip';
import { Msg, useMessages } from 'core/i18n';

type ParticipantSummaryCardProps = {
  eventId: number;
  onClickRecord: () => void;
  orgId: number;
};

const ParticipantSummaryCard: FC<ParticipantSummaryCardProps> = ({
  eventId,
  onClickRecord,
  orgId,
}) => {
  const eventData = useEventData(orgId, eventId).data;
  const participantStatus = useParticipantStatus(orgId, eventId);
  const {
    respondentsFuture,
    numAvailParticipants,
    numCancelledParticipants,
    numConfirmedParticipants,
    numNoshowParticipants,
    numRemindedParticipants,
    numSignedParticipants,
  } = useEventParticipantsData(orgId, eventId);
  const { addParticipant, setReqParticipants, sendReminders } =
    useEventParticipantsMutations(orgId, eventId);
  const respondents = respondentsFuture.data;
  const messages = useMessages(messageIds);

  const reqParticipants = eventData?.num_participants_required ?? 0;
  const contactPerson = eventData?.contact;

  const hasRecordedAttendance =
    numCancelledParticipants +
      numConfirmedParticipants +
      numNoshowParticipants >
    0;

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
        header={messages.participantSummaryCard.header()}
        status={
          <Box display="flex" mb={4}>
            <ZUINumberChip
              color={participantStatus}
              outlined={true}
              size="sm"
              value={`${numAvailParticipants}/${reqParticipants}`}
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
                      helperText={messages.participantSummaryCard.reqParticipantsHelperText()}
                      label={messages.participantSummaryCard.reqParticipantsLabel()}
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
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" flexDirection="column">
            <Typography color={'secondary'}>
              {messages.participantSummaryCard.pending()}
            </Typography>
            <Box display="flex">
              <Typography variant="h4">{numSignedParticipants}</Typography>
              {numSignedParticipants > 0 && (
                <Button
                  onClick={() => {
                    respondents?.map((r) => {
                      addParticipant(r.person.id);
                    });
                  }}
                  size="small"
                  startIcon={<Check />}
                  sx={{
                    marginLeft: 2,
                  }}
                  variant="outlined"
                >
                  <Msg id={messageIds.participantSummaryCard.bookButton} />
                </Button>
              )}
            </Box>
          </Box>
          {new Date(removeOffset(eventData.start_time)) > new Date() ? (
            <Box display="flex" flexDirection="column">
              <Typography color={'secondary'}>
                {messages.participantSummaryCard.booked()}
              </Typography>
              <Box alignItems="center" display="flex">
                <Typography variant="h4">{`${numRemindedParticipants}/${numAvailParticipants}`}</Typography>
                {numRemindedParticipants < numAvailParticipants && (
                  <Tooltip
                    arrow
                    placement="top-start"
                    title={
                      contactPerson == null
                        ? messages.participantSummaryCard.remindButtondisabledTooltip()
                        : ''
                    }
                  >
                    <Box>
                      <Button
                        disabled={contactPerson == null}
                        onClick={() => {
                          sendReminders(eventId);
                        }}
                        size="small"
                        startIcon={<Check />}
                        sx={{
                          marginLeft: 2,
                        }}
                        variant="outlined"
                      >
                        <Msg
                          id={messageIds.participantSummaryCard.remindButton}
                        />
                      </Button>
                    </Box>
                  </Tooltip>
                )}
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column">
              <Typography color={'secondary'}>
                {messages.participantSummaryCard.confirmed()}
              </Typography>
              <Box alignItems="center" display="flex">
                <Typography variant="h4">{`${numConfirmedParticipants}/${numAvailParticipants}`}</Typography>
                {numNoshowParticipants > 0 && (
                  <Typography
                    color={'GrayText'}
                    ml={1}
                    sx={{ fontSize: '1.7em' }}
                    variant="h4"
                  >
                    {messages.participantSummaryCard.noshow({
                      noshows: numNoshowParticipants,
                    })}
                  </Typography>
                )}
                {!hasRecordedAttendance && (
                  <Box ml={2}>
                    <Button
                      onClick={() => onClickRecord()}
                      size="small"
                      variant="outlined"
                    >
                      <Msg
                        id={messageIds.participantSummaryCard.recordButton}
                      />
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          <Box display="flex" flexDirection="column">
            <Typography color={'secondary'}>
              {messages.participantSummaryCard.cancelled()}
            </Typography>
            <Box display="flex">
              <Typography variant="h4">{`${numCancelledParticipants}`}</Typography>
            </Box>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            marginBottom={1}
          />
        </Box>
      </ZUICard>
    </Box>
  );
};

export default ParticipantSummaryCard;
