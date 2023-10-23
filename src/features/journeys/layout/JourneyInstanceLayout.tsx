import { FormattedDate } from 'react-intl';
import { Forward } from '@mui/icons-material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';

import { journeyInstanceResource } from 'features/journeys/api/journeys';
import JourneyStatusChip from '../components/JourneyStatusChip';
import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useJourneys from '../hooks/useJourneys';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinJourneyInstance } from 'utils/types/zetkin';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import JourneyInstanceCloseButton, {
  JourneyInstanceReopenButton,
} from '../components/JourneyInstanceCloseButton';
import { Msg, useMessages } from 'core/i18n';

interface JourneyInstanceLayoutProps {
  children: React.ReactNode;
}

const JourneyInstanceLayout: React.FunctionComponent<
  JourneyInstanceLayoutProps
> = ({ children }) => {
  const messages = useMessages(messageIds);
  const { orgId, journeyId, instanceId } = useNumericRouteParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { showSnackbar } = useContext(ZUISnackbarContext);

  const journeyInstanceQuery = journeyInstanceResource(
    orgId.toString(),
    instanceId.toString()
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  const journeysFuture = useJourneys(orgId);

  const journeyInstanceHooks = journeyInstanceResource(
    orgId.toString(),
    instanceId.toString()
  );
  const patchJourneyInstanceMutation = journeyInstanceHooks.useUpdate();

  const updateTitle = async (newTitle: string) => {
    patchJourneyInstanceMutation.mutateAsync(
      { title: newTitle },
      {
        onError: () => {
          showSnackbar(
            'error',
            messages.journeys.editJourneyTitleAlert.error()
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
            messages.journeys.editJourneyTitleAlert.success()
          );
        },
      }
    );
  };

  const ellipsisMenu: ZUIEllipsisMenuProps['items'] = [];

  const submenuItems =
    journeysFuture.data
      ?.filter((journey) => journey.id !== journeyId)
      .map((journey) => ({
        id: `convertTo-${journey.id}`,
        label: journey.singular_label,
        onSelect: () => {
          //redirect to equivalent page but new journey id
          const redirectUrl = router.pathname
            .replace('[orgId]', orgId.toString())
            .replace('[journeyId]', journey.id.toString())
            .replace('[instanceId]', instanceId.toString());

          patchJourneyInstanceMutation.mutateAsync(
            {
              journey_id: journey.id,
            },
            {
              onError: () =>
                showSnackbar(
                  'error',
                  messages.journeys.conversionSnackbar.error()
                ),
              onSuccess: () => {
                showSnackbar(
                  'success',
                  messages.journeys.conversionSnackbar.success()
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
      label: messages.instance.ellipsisMenu.convert(),
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
                id={messageIds.instance.created}
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
                  id={messageIds.instance.updated}
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
          label: messages.journeys.tabs.timeline(),
        },
        {
          href: '/milestones',
          label: messages.journeys.tabs.milestones(),
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
