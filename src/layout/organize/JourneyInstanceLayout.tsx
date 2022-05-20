import { Forward } from '@material-ui/icons';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from '@material-ui/core';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';

import JourneyStatusChip from 'components/journeys/JourneyStatusChip';
import SnackbarContext from 'hooks/SnackbarContext';
import TabbedLayout from './TabbedLayout';
import { ZetkinEllipsisMenuProps } from 'components/ZetkinEllipsisMenu';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { journeyInstanceResource, journeysResource } from 'api/journeys';

const JourneyInstanceLayout: React.FunctionComponent = ({ children }) => {
  const { orgId, journeyId, instanceId } = useRouter().query;
  const router = useRouter();
  const intl = useIntl();
  const { showSnackbar } = useContext(SnackbarContext);

  const journeyInstanceQuery = journeyInstanceResource(
    orgId as string,
    instanceId as string
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  const journeysQuery = journeysResource(orgId as string).useQuery();
  const journeys = journeysQuery.data;

  const journeyInstanceHooks = journeyInstanceResource(
    orgId as string,
    instanceId as string
  );
  const patchJourneyInstanceMutation = journeyInstanceHooks.useUpdate();

  const ellipsisMenu: ZetkinEllipsisMenuProps['items'] = [];

  const submenuItems =
    journeys
      ?.filter((journey) => journey.id.toString() !== journeyId)
      .map((journey) => ({
        id: `convertTo-${journey.id}`,
        label: journey.singular_label,
        onSelect: () => {
          patchJourneyInstanceMutation.mutateAsync(
            {
              journey_id: journey.id,
            },
            {
              onError: () =>
                showSnackbar(
                  'error',
                  intl.formatMessage({
                    id: 'misc.journeys.conversionSnackbar.error',
                  })
                ),
              onSuccess: () => {
                showSnackbar(
                  'success',
                  intl.formatMessage({
                    id: 'misc.journeys.conversionSnackbar.success',
                  })
                );
                router.push(
                  `/organize/${orgId}/journeys/${journey.id}/${instanceId}`
                );
              },
            }
          );
        },
      })) ?? [];

  if (submenuItems.length) {
    ellipsisMenu.push({
      id: 'convert-journey',
      label: intl.formatMessage({
        id: 'pages.organizeJourneyInstance.ellipsisMenu.convert',
      }),
      startIcon: <Forward color="secondary" />,
      subMenuItems: submenuItems,
    });
  }

  return (
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
  );
};

export default JourneyInstanceLayout;
