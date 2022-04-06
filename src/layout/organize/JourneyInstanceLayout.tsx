import ScheduleIcon from '@material-ui/icons/Schedule';
import { useRouter } from 'next/router';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';

import { journeyInstanceResource } from 'api/journeys';
import TabbedLayout from './TabbedLayout';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { Box, Button, Chip, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  closedChip: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
    fontWeight: 'bold',
    marginRight: '1rem',
  },
  openChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    fontWeight: 'bold',
    marginRight: '1rem',
  },
}));

const JourneyStatusChip = ({ status }: { status: string }) => {
  const intl = useIntl();
  const classes = useStyles();
  return status === 'open' ? (
    <Chip
      className={classes.openChip}
      label={intl.formatMessage({
        id: 'layout.organize.journeys.statusOpen',
      })}
    />
  ) : (
    <Chip
      className={classes.closedChip}
      label={intl.formatMessage({
        id: 'layout.organize.journeys.statusClosed',
      })}
    />
  );
};

const JourneyInstanceLayout: React.FunctionComponent = ({ children }) => {
  const { orgId, journeyId, instanceId } = useRouter().query;
  const intl = useIntl();

  const journeyInstanceQuery = journeyInstanceResource(
    orgId as string,
    journeyId as string,
    instanceId as string
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  return (
    <TabbedLayout
      actionButtons={
        <Box>
          <Button
            color="primary"
            style={{ textTransform: 'uppercase' }}
            variant="contained"
          >
            {intl.formatMessage({
              id:
                journeyInstance.status === 'open'
                  ? 'layout.organize.journeys.buttonClose'
                  : 'layout.organize.journeys.buttonOpen',
            })}
          </Button>
        </Box>
      }
      baseHref={`/organize/${orgId}/journeys/${journeyId}/instances/${instanceId}`}
      defaultTab="/"
      subtitle={
        <Box
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <JourneyStatusChip status={journeyInstance.status} />
          <Typography style={{ marginRight: '1rem' }}>
            <Msg id="layout.organize.journeys.lastActivity" />{' '}
            <ZetkinRelativeTime datetime={journeyInstance.updated_at} />
          </Typography>
          {journeyInstance.next_milestone && (
            <>
              <ScheduleIcon
                color="secondary"
                style={{ marginRight: '0.25rem' }}
              />
              <Typography>
                {journeyInstance.next_milestone?.title}{' '}
                <FormattedDate
                  day="numeric"
                  month="long"
                  value={journeyInstance.next_milestone?.deadline}
                  year="numeric"
                />
              </Typography>
            </>
          )}
        </Box>
      }
      tabs={[
        {
          href: '/',
          messageId: 'layout.organize.journeys.tabs.timeline',
        },
      ]}
      title={
        <>
          {`${journeyInstance.title || journeyInstance.journey.title} `}
          <Typography
            color="secondary"
            variant="h3"
          >{`\u00A0#${journeyInstance.id}`}</Typography>
        </>
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default JourneyInstanceLayout;
