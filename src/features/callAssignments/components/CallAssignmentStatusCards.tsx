import { useIntl } from 'react-intl';
import { Card, Grid, List } from '@material-ui/core';

import { CallAssignmentStats } from '../apiTypes';
import StatusSectionHeader from './StatusSectionHeader';
import StatusSectionItem from './StatusSectionItem';

//TO-DO: Replace with theme colors
const ORANGE = 'rgba(245, 124, 0, 1)';
const GREEN = 'rgba(102, 187, 106, 1)';
const BLUE = 'rgba(25, 118, 210, 1)';

interface CallAssignmentStatusCardProps {
  stats: CallAssignmentStats;
  targetingDone: boolean;
}

const CallAssignmentStatusCards = ({
  stats,
  targetingDone,
}: CallAssignmentStatusCardProps) => {
  const intl = useIntl();
  return (
    <Grid container spacing={2}>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusSectionHeader
            chipColor={ORANGE}
            subtitle={intl.formatMessage({
              id: 'pages.organizeCallAssignment.blocked.subtitle',
            })}
            targetingDone={targetingDone}
            title={intl.formatMessage({
              id: 'pages.organizeCallAssignment.blocked.title',
            })}
            value={stats.blocked}
          />
          <List>
            <StatusSectionItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.blocked.calledTooRecently',
              })}
              value={stats.calledTooRecently}
            />
            <StatusSectionItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.blocked.callBackLater',
              })}
              value={stats.callBackLater}
            />
            <StatusSectionItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.blocked.missingPhoneNumber',
              })}
              value={stats.missingPhoneNumber}
            />
            <StatusSectionItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.blocked.organizerActionNeeded',
              })}
              value={stats.organizerActionNeeded}
            />
          </List>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusSectionHeader
            chipColor={GREEN}
            subtitle={intl.formatMessage({
              id: 'pages.organizeCallAssignment.ready.subtitle',
            })}
            targetingDone={targetingDone}
            title={intl.formatMessage({
              id: 'pages.organizeCallAssignment.ready.title',
            })}
            value={stats.ready}
          />
          <List>
            <StatusSectionItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.ready.queue',
              })}
              value={stats.queue}
            />
            <StatusSectionItem
              title={intl.formatMessage({
                id: 'pages.organizeCallAssignment.ready.allocated',
              })}
              value={stats.allocated}
            />
          </List>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <StatusSectionHeader
            chipColor={BLUE}
            subtitle={intl.formatMessage({
              id: 'pages.organizeCallAssignment.done.subtitle',
            })}
            targetingDone={targetingDone}
            title={intl.formatMessage({
              id: 'pages.organizeCallAssignment.done.title',
            })}
            value={stats.done}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default CallAssignmentStatusCards;
