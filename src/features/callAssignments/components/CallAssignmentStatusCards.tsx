import SettingsIcon from '@material-ui/icons/Settings';
import { useIntl } from 'react-intl';
import { Box, Card, Grid, List, Typography } from '@material-ui/core';

import CallAssignmentModel from '../models/CallAssignmentModel';
import StatusCardHeader from './StatusCardHeader';
import StatusCardItem from './StatusCardItem';

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
                    {cooldown} hours
                  </Typography>
                  <SettingsIcon color="secondary" cursor="pointer" />
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
