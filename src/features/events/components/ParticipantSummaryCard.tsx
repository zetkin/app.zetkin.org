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

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import ZUICard from 'zui/ZUICard';
import ZUINumberChip from 'zui/ZUINumberChip';
import { Msg, useMessages } from 'core/i18n';

type ParticipantSummaryCardProps = {
  model: EventDataModel;
  onClickRecord: () => void;
};

const ParticipantSummaryCard: FC<ParticipantSummaryCardProps> = ({
  model,
  onClickRecord,
}) => {
  const eventData = model.getData().data;
  const respondents = model.getRespondents().data;
  const messages = useMessages(messageIds);

  const reqParticipants = eventData?.num_participants_required ?? 0;
  const availParticipants = model.getNumAvailParticipants();
  const remindedParticipants = model.getNumRemindedParticipants();
  const cancelledParticipants = model.getNumCancelledParticipants();

  const signedParticipants = model.getNumSignedParticipants();
  const contactPerson = eventData?.contact;
  const confirmedParticipants = model.getNumConfirmedParticipants();
  const noshowParticipants = model.getNumNoshowParticipants();

  const hasRecordedAttendance =
    cancelledParticipants + confirmedParticipants + noshowParticipants > 0;

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
              color={model.getParticipantStatus()}
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
                    model.setReqParticipants(newReqParticipants);
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
                            model.setReqParticipants(newReqParticipants);
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
              <Typography variant="h4">{signedParticipants}</Typography>
              {signedParticipants > 0 && (
                <Button
                  onClick={() => {
                    respondents?.map((r) => {
                      model.addParticipant(r.person.id);
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
          {new Date(eventData.start_time) > new Date() ? (
            <Box display="flex" flexDirection="column">
              <Typography color={'secondary'}>
                {messages.participantSummaryCard.booked()}
              </Typography>
              <Box display="flex">
                <Typography variant="h4">{`${remindedParticipants}/${availParticipants}`}</Typography>
                {remindedParticipants < availParticipants && (
                  <Tooltip
                    arrow
                    placement="top-start"
                    title={
                      contactPerson == null
                        ? messages.participantSummaryCard.remindButtondisabledTooltip()
                        : ''
                    }
                  >
                    <Box sx={{margin: "auto"}}>
                      <Button
                        disabled={contactPerson == null}
                        onClick={() => {
                          model.sendReminders();
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
                <Typography variant="h4">{`${confirmedParticipants}/${availParticipants}`}</Typography>
                {noshowParticipants > 0 && (
                  <Typography
                    color={'GrayText'}
                    ml={1}
                    sx={{ fontSize: '1.7em' }}
                    variant="h4"
                  >
                    {messages.participantSummaryCard.noshow({
                      noshows: noshowParticipants,
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
              <Typography variant="h4">{`${cancelledParticipants}`}</Typography>
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
