import ScheduleIcon from '@material-ui/icons/Schedule';
import { useRouter } from 'next/router';
import { Box, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import { journeyInstanceResource } from 'api/journeys';
import JourneyStatusChip from 'components/journeys/JourneyStatusChip';
import TabbedLayout from './TabbedLayout';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import JourneyInstanceCloseButton, {
  JourneyInstanceReopenButton,
} from 'components/journeys/JourneyInstanceCloseButton';

const JourneyInstanceLayout: React.FunctionComponent = ({ children }) => {
  const { orgId, journeyId, instanceId } = useRouter().query;

  const journeyInstanceQuery = journeyInstanceResource(
    orgId as string,
    instanceId as string
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  return (
    <TabbedLayout
      actionButtons={
        journeyInstance.closed ? (
          <JourneyInstanceReopenButton journeyInstance={journeyInstance} />
        ) : (
          <JourneyInstanceCloseButton journeyInstance={journeyInstance} />
        )
      }
      baseHref={`/organize/${orgId}/journeys/${journeyId}/${instanceId}`}
      defaultTab="/"
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
  );
};

export default JourneyInstanceLayout;
