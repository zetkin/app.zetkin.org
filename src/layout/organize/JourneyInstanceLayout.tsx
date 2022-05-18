import { Forward } from '@material-ui/icons';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useRouter } from 'next/router';
import { Box, Chip, makeStyles, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';

import TabbedLayout from './TabbedLayout';
import { ZetkinEllipsisMenuProps } from 'components/ZetkinEllipsisMenu';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { journeyInstanceResource, journeysResource } from 'api/journeys';
import { ZetkinJourney, ZetkinJourneyInstance } from 'types/zetkin';

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

const JourneyStatusChip = ({
  instance,
}: {
  instance: ZetkinJourneyInstance;
}) => {
  const intl = useIntl();
  const classes = useStyles();
  return !instance.closed ? (
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
    instanceId as string
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  const journeysQuery = journeysResource(orgId as string).useQuery();
  const journeys = journeysQuery.data as ZetkinJourney[];

  const ellipsisMenu: ZetkinEllipsisMenuProps['items'] = [];

  ellipsisMenu.push({
    id: 'convert-journey',
    label: intl.formatMessage({
      id: 'pages.organizeJourneyInstance.ellipsisMenu.convert',
    }),
    onSelect: () => {
      //todo
    },
    startIcon: <Forward color="secondary" />,
    subMenuItems: journeys
      ?.filter((journey) => journey.id.toString() !== journeyId)
      .map((journey) => ({
        id: `convert-journey-submenu-${journey.id}`,
        label: journey.singular_label,
        onSelect: () => {
          //todo
        },
      })),
  });

  /* , */

  return (
    <>
      <TabbedLayout
        baseHref={`/organize/${orgId}/journeys/${journeyId}/${instanceId}`}
        defaultTab="/"
        ellipsisMenuItems={ellipsisMenu}
        subtitle={
          <Box
            style={{
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <JourneyStatusChip instance={journeyInstance} />
            <Typography style={{ marginRight: '1rem' }}>
              <Msg id="layout.organize.journeys.lastActivity" />{' '}
              <ZetkinRelativeTime datetime={journeyInstance.updated} />
            </Typography>
            {journeyInstance.next_milestone && (
              <>
                <ScheduleIcon
                  color="secondary"
                  style={{ marginRight: '0.25rem' }}
                />
                <Typography>
                  {journeyInstance.next_milestone.title}
                  {': '}
                  {journeyInstance.next_milestone.deadline && (
                    <FormattedDate
                      day="numeric"
                      month="long"
                      value={journeyInstance.next_milestone.deadline}
                      year="numeric"
                    />
                  )}
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
          {
            href: '/milestones',
            messageId: 'layout.organize.journeys.tabs.milestones',
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
    </>
  );
};

export default JourneyInstanceLayout;
