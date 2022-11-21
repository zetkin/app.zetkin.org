import SettingsIcon from '@material-ui/icons/Settings';
import {
  Box,
  Card,
  ClickAwayListener,
  Grid,
  List,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@material-ui/core';
import { FormattedMessage as Msg, useIntl } from 'react-intl';

import CallAssignmentModel from '../models/CallAssignmentModel';
import StatusCardHeader from './StatusCardHeader';
import StatusCardItem from './StatusCardItem';
import { useState } from 'react';

interface CallAssignmentStatusCardProps {
  model: CallAssignmentModel;
}

const CallAssignmentStatusCards = ({
  model,
}: CallAssignmentStatusCardProps) => {
  const intl = useIntl();
  const stats = model.getStats();
  const { cooldown } = model.getData();
  const hasTargets = model.hasTargets;

  const [anchorEl, setAnchorEl] = useState<
    null | (EventTarget & SVGSVGElement)
  >(null);
  const [newCooldown, setNewCooldown] = useState<number | null>(cooldown);

  return (
    <Grid container spacing={2}>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusCardHeader
            chipColor={hasTargets ? 'orange' : 'gray'}
            subtitle={intl.formatMessage({
              id: 'pages.organizeCallAssignment.blocked.subtitle',
            })}
            title={intl.formatMessage({
              id: 'pages.organizeCallAssignment.blocked.title',
            })}
            value={stats?.blocked}
          />
          <List>
            <StatusCardItem
              action={
                <Box display="flex" justifyContent="space-between">
                  <Typography color="secondary" variant="h5">
                    <Msg
                      id="pages.organizeCallAssignment.blocked.hours"
                      values={{ cooldown }}
                    />
                  </Typography>
                  <Box ml={1}>
                    <SettingsIcon
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
                        if (newCooldown && newCooldown != cooldown) {
                          model.setCooldown(newCooldown);
                        }
                      }}
                    >
                      <Paper elevation={3} variant="elevation">
                        <Box mt={1} p={2}>
                          <TextField
                            helperText={intl.formatMessage({
                              id: 'pages.organizeCallAssignment.blocked.cooldownHelperText',
                            })}
                            label={intl.formatMessage({
                              id: 'pages.organizeCallAssignment.blocked.cooldownLabel',
                            })}
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
                                if (newCooldown && newCooldown != cooldown) {
                                  setAnchorEl(null);
                                  model.setCooldown(newCooldown);
                                  // If user has not changed the cooldown, do nothing
                                } else {
                                  setAnchorEl(null);
                                }
                                //if user exits, reset value
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
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.blocked.calledTooRecently',
              })}
              value={stats?.calledTooRecently}
            />
            <StatusCardItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.blocked.callBackLater',
              })}
              value={stats?.callBackLater}
            />
            <StatusCardItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.blocked.missingPhoneNumber',
              })}
              value={stats?.missingPhoneNumber}
            />
            <StatusCardItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.blocked.organizerActionNeeded',
              })}
              value={stats?.organizerActionNeeded}
            />
          </List>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusCardHeader
            chipColor={hasTargets ? 'green' : 'gray'}
            subtitle={intl.formatMessage({
              id: 'pages.organizeCallAssignment.ready.subtitle',
            })}
            title={intl.formatMessage({
              id: 'pages.organizeCallAssignment.ready.title',
            })}
            value={stats?.ready}
          />
          <List>
            <StatusCardItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.ready.queue',
              })}
              value={stats?.queue}
            />
            <StatusCardItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.ready.allocated',
              })}
              value={stats?.allocated}
            />
          </List>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusCardHeader
            chipColor={hasTargets ? 'blue' : 'gray'}
            subtitle={intl.formatMessage({
              id: 'pages.organizeCallAssignment.done.subtitle',
            })}
            title={intl.formatMessage({
              id: 'pages.organizeCallAssignment.done.title',
            })}
            value={stats?.done}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default CallAssignmentStatusCards;
