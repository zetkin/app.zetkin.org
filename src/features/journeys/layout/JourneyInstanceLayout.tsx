import { Forward } from '@mui/icons-material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';

import JourneyStatusChip from '../components/JourneyStatusChip';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import JourneyInstanceCloseButton, {
  JourneyInstanceReopenButton,
} from '../components/JourneyInstanceCloseButton';
import {
  journeyInstanceResource,
  journeysResource,
} from 'features/journeys/api/journeys';

interface JourneyInstanceLayoutProps {
  children: React.ReactNode;
}

const JourneyInstanceLayout: React.FunctionComponent<
  JourneyInstanceLayoutProps
> = ({ children }) => {
  const { orgId, journeyId, instanceId } = useRouter().query;
  const router = useRouter();
  const intl = useIntl();
  const queryClient = useQueryClient();

  const { showSnackbar } = useContext(ZUISnackbarContext);

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

  const updateTitle = async (newTitle: string) => {
    patchJourneyInstanceMutation.mutateAsync(
      { title: newTitle },
      {
        onError: () => {
          showSnackbar(
            'error',
            intl.formatMessage({
              id: `misc.journeys.editJourneyTitleAlert.error`,
            })
          );
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries('breadcrumbs');
          await queryClient.invalidateQueries([
            'journeyInstance',
            orgId,
            instanceId,
          ]);
          showSnackbar(
            'success',
            intl.formatMessage({
              id: `misc.journeys.editJourneyTitleAlert.success`,
            })
          );
        },
      }
    );
  };

  const ellipsisMenu: ZUIEllipsisMenuProps['items'] = [];

  const submenuItems =
    journeys
      ?.filter((journey) => journey.id.toString() !== journeyId)
      .map((journey) => ({
        id: `convertTo-${journey.id}`,
        label: journey.singular_label,
        onSelect: () => {
          //redirect to equivalent page but new journey id
          const redirectUrl = router.pathname
            .replace('[orgId]', orgId as string)
            .replace('[journeyId]', journey.id.toString())
            .replace('[instanceId]', instanceId as string);

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
                router.push(redirectUrl);
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
      actionButtons={
        journeyInstance.closed ? (
          <JourneyInstanceReopenButton journeyInstance={journeyInstance} />
        ) : (
          <JourneyInstanceCloseButton journeyInstance={journeyInstance} />
        )
      }
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
          <Box mr={1}>
            <JourneyStatusChip instance={journeyInstance} />
          </Box>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginRight: '1rem',
            }}
          >
            <Typography>
              <Msg
                id="layout.organize.journeyInstance.created"
                values={{
                  relative: (
                    <ZUIRelativeTime
                      convertToLocal
                      datetime={journeyInstance.created}
                      forcePast
                    />
                  ),
                }}
              />
            </Typography>
            {journeyInstance.updated && (
              <Typography>
                {'\u00A0('}
                <Msg
                  id="layout.organize.journeyInstance.updated"
                  values={{
                    relative: (
                      <ZUIRelativeTime
                        convertToLocal
                        datetime={journeyInstance.updated}
                        forcePast
                      />
                    ),
                  }}
                />
                {')'}
              </Typography>
            )}
          </Box>
          {journeyInstance.next_milestone && (
            <>
              <ScheduleIcon
                color="secondary"
                style={{ marginRight: '0.25rem' }}
              />
              <Typography>
                {journeyInstance.next_milestone.title}
                {journeyInstance.next_milestone.deadline && (
                  <>
                    {': '}
                    <FormattedDate
                      day="numeric"
                      month="long"
                      value={journeyInstance.next_milestone.deadline}
                      year="numeric"
                    />
                  </>
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
        <Box
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <ZUIEditTextinPlace
            disabled={patchJourneyInstanceMutation.isLoading}
            onChange={(newTitle) => updateTitle(newTitle)}
            value={journeyInstance.title || journeyInstance.journey.title}
          />
          <Typography
            color="secondary"
            variant="h3"
          >{`\u00A0#${journeyInstance.id}`}</Typography>
        </Box>
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default JourneyInstanceLayout;
