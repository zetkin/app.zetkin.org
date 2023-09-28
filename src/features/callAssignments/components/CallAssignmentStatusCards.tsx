import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  ClickAwayListener,
  Grid,
  List,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import { Edit, Settings, Visibility } from '@mui/icons-material';

import CallAssignmentModel from '../models/CallAssignmentModel';
import SmartSearchDialog from 'features/smartSearch/components/SmartSearchDialog';
import StatusCardHeader from './StatusCardHeader';
import StatusCardItem from './StatusCardItem';
import ViewBrowserModel from 'features/views/models/ViewBrowserModel';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';
import useModel from 'core/useModel';
import { useRouter } from 'next/router';
import useOrganizerActionView from 'features/views/hooks/useOrganizerActionView';

interface CallAssignmentStatusCardProps {
  model: CallAssignmentModel;
}

const CallAssignmentStatusCards = ({
  model,
}: CallAssignmentStatusCardProps) => {
  const messages = useMessages(messageIds);
  const { data: stats } = model.getStats();
  const { data } = model.getData();
  const cooldown = data?.cooldown ?? null;
  const hasTargets = model.hasTargets;
  const goalQuery = data?.goal;

  const { orgId } = useRouter().query;

  const viewsModel: ViewBrowserModel = useModel(
    (env) => new ViewBrowserModel(env, parseInt(orgId as string))
  );

  // const { what } = useOrganizerActionView(parseInt(orgId as string));

  const [anchorEl, setAnchorEl] = useState<
    null | (EventTarget & SVGSVGElement)
  >(null);
  const [newCooldown, setNewCooldown] = useState<number | null>(cooldown);
  const [queryDialogOpen, setQueryDialogOpen] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusCardHeader
            chipColor={hasTargets ? 'orange' : 'gray'}
            subtitle={messages.blocked.subtitle()}
            title={messages.blocked.title()}
            value={stats?.blocked}
          />
          <List>
            <StatusCardItem
              action={
                <Box display="flex" justifyContent="space-between">
                  <Typography color="secondary" variant="h5">
                    <Msg
                      id={messageIds.blocked.hours}
                      values={{ cooldown: cooldown || 0 }}
                    />
                  </Typography>
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
                        if (newCooldown != null && newCooldown != cooldown) {
                          model.setCooldown(newCooldown);
                        }
                      }}
                    >
                      <Paper elevation={3} variant="elevation">
                        <Box mt={1} p={2}>
                          <TextField
                            helperText={messages.blocked.cooldownHelperText()}
                            label={messages.blocked.cooldownLabel()}
                            onChange={(ev) => {
                              const val = ev.target.value;

                              if (val == '') {
                                setNewCooldown(null);
                                return;
                              }

                              const intVal = parseInt(val);
                              if (!isNaN(intVal) && intVal.toString() == val) {
                                setNewCooldown(intVal);
                              }
                            }}
                            onKeyDown={(ev) => {
                              if (ev.key === 'Enter') {
                                setAnchorEl(null);
                                if (newCooldown != null) {
                                  model.setCooldown(newCooldown);
                                }
                              } else if (ev.key === 'Escape') {
                                setAnchorEl(null);
                                setNewCooldown(cooldown);
                              }
                            }}
                            value={newCooldown === null ? '' : newCooldown}
                            variant="outlined"
                          />
                        </Box>
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
                </Box>
              }
              title={messages.blocked.calledTooRecently()}
              value={stats?.calledTooRecently}
            />
            <StatusCardItem
              title={messages.blocked.callBackLater()}
              value={stats?.callBackLater}
            />
            <StatusCardItem
              title={messages.blocked.missingPhoneNumber()}
              value={stats?.missingPhoneNumber}
            />
            <StatusCardItem
              action={
                <Button
                  onClick={() => viewsModel.getOrganizerActionView()}
                  startIcon={<Visibility />}
                  variant="outlined"
                >
                  <Msg id={messageIds.blocked.viewSheetButton} />
                </Button>
              }
              title={messages.blocked.organizerActionNeeded()}
              value={stats?.organizerActionNeeded}
            />
          </List>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusCardHeader
            chipColor={hasTargets ? 'blue' : 'gray'}
            subtitle={messages.ready.subtitle()}
            title={messages.ready.title()}
            value={stats?.ready}
          />
          <List>
            <StatusCardItem
              title={messages.ready.queue()}
              value={stats?.queue}
            />
            <StatusCardItem
              title={messages.ready.allocated()}
              value={stats?.allocated}
            />
          </List>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusCardHeader
            chipColor={hasTargets ? 'green' : 'gray'}
            subtitle={messages.done.subtitle()}
            title={messages.done.title()}
            value={stats?.done}
          />
          <Box p={2}>
            <Button
              onClick={() => setQueryDialogOpen(true)}
              startIcon={<Edit />}
              variant="outlined"
            >
              <Msg id={messageIds.done.defineButton} />
            </Button>
            {queryDialogOpen && (
              <SmartSearchDialog
                onDialogClose={() => setQueryDialogOpen(false)}
                onSave={(query) => {
                  model.setGoal(query);
                  setQueryDialogOpen(false);
                }}
                query={goalQuery}
              />
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CallAssignmentStatusCards;
