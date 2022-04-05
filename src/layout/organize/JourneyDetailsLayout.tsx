import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { Settings } from '@material-ui/icons';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import { journeyInstanceResource } from 'api/journeys';
import TabbedLayout from './TabbedLayout';
import ZetkinEllipsisMenu from 'components/ZetkinEllipsisMenu';
import { ZetkinJourneyInstance } from 'types/zetkin';
import { Box, Button, Chip, makeStyles, Typography } from '@material-ui/core';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('sv', {
  relativeTime: {
    M: 'en månad',
    MM: '%d månader',
    d: 'en dag',
    dd: '%d dagar',
    future: 'om %s',
    h: 'en timme',
    hh: '%d timmar',
    m: 'en minut',
    mm: '%d minuter',
    past: '%s sedan',
    s: 'några sekunder',
    y: 'a year',
    yy: '%d år',
  },
});

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
        id: 'layout.organize.journeys.open',
      })}
    />
  ) : (
    <Chip
      className={classes.closedChip}
      label={intl.formatMessage({
        id: 'layout.organize.journeys.closed',
      })}
    />
  );
};

const JourneyDetailsLayout: React.FunctionComponent = ({ children }) => {
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
                  ? 'layout.organize.journeys.close'
                  : 'layout.organize.journeys.open',
            })}
          </Button>
          <ZetkinEllipsisMenu
            items={[
              {
                id: 'test',
                label: (
                  <>
                    <Box mr={1}>
                      <Settings />
                    </Box>
                    Test
                  </>
                ),
                onSelect: () => null,
              },
            ]}
          />
        </Box>
      }
      baseHref={`/organize/${orgId}/journeys/${journeyId}/instances/${instanceId}`}
      defaultTab="/timeline"
      subtitle={
        <Box
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <JourneyStatusChip status={journeyInstance.status} />
          <Typography style={{ marginRight: '1rem' }}>
            {`${intl.formatMessage({
              id: 'layout.organize.journeys.lastActivity',
            })}
            ${dayjs().to(journeyInstance.updated_at)}`}
          </Typography>
          <ScheduleIcon color="secondary" style={{ marginRight: '0.25rem' }} />
          <Typography>
            {`${journeyInstance.next_milestone?.title}: ${dayjs(
              journeyInstance.next_milestone?.deadline
            ).format('DD MMMM YYYY')}`}
          </Typography>
        </Box>
      }
      tabs={[
        {
          href: `/timeline`,
          messageId: 'layout.organize.journeys.tabs.timeline',
        },
      ]}
      title={`${
        journeyInstance.title
          ? journeyInstance.title
          : journeyInstance.journey.title
      } #${journeyInstance.id}`}
    >
      {children}
    </TabbedLayout>
  );
};

export default JourneyDetailsLayout;
