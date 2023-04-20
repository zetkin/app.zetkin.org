import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import { Check, Settings } from '@mui/icons-material';
import { FC, useState } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import ZUICard from 'zui/ZUICard';
import ZUINumberChip from 'zui/ZUINumberChip';
import { Msg, useMessages } from 'core/i18n';

type ParticipantSummaryCardProps = {
  model: EventDataModel;
};

const ParticipantSummaryCard: FC<ParticipantSummaryCardProps> = ({ model }) => {
  const eventData = model.getData().data;
  const participants = model.getParticipants().data;
  const respondents = model.getRespondents().data;
  const messages = useMessages(messageIds);
  const reqParticipants = eventData?.num_participants_required ?? 0;
  const availParticipants = participants?.length ?? 0;
  const remindedParticipants =
    participants?.filter((p) => p.reminder_sent != null).length ?? 0;
  const signedParticipants =
    respondents?.filter((r) => !participants?.some((p) => p.id === r.id))
      .length ?? 0;
  const contactPerson = eventData?.contact;

  const [newReqParticipants, setNewReqParticipants] = useState<number | null>(
    reqParticipants
  );
  const [anchorEl, setAnchorEl] = useState<
    null | (EventTarget & SVGSVGElement)
  >(null);

  if (!eventData) {
    return null;
  }

  const getParticipantStatus = () => {
    const diff = reqParticipants - availParticipants;

    if (diff <= 0) {
      return theme.palette.statusColors.green;
    } else if (diff === 1) {
      return theme.palette.statusColors.orange;
    } else {
      return theme.palette.statusColors.red;
    }
  };

  return (
    <Box>
      <ZUICard
        header={messages.participantSummaryCard.header()}
        status={
          <Box display="flex">
            <ZUINumberChip
              color={getParticipantStatus()}
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
          <Box display="flex" flexDirection="column">
            <Typography color={'secondary'}>
              {messages.participantSummaryCard.booked()}
            </Typography>
            <Box display="flex">
              <Typography variant="h4">{`${remindedParticipants}/${availParticipants}`}</Typography>
              {remindedParticipants < availParticipants && (
                <Button
                  disabled={contactPerson == null}
                  onClick={() => {
                    model.sendReminders();
                  }}
                  startIcon={<Check />}
                  sx={{
                    marginLeft: 2,
                  }}
                  variant="outlined"
                >
                  <Msg id={messageIds.participantSummaryCard.remindButton} />
                </Button>
              )}
            </Box>
          </Box>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            marginBottom={1}
          ></Box>
        </Box>
      </ZUICard>
    </Box>
  );
};

export default ParticipantSummaryCard;
