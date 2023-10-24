import { FormattedDate } from 'react-intl';
import { Forward } from '@mui/icons-material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';

import JourneyStatusChip from '../components/JourneyStatusChip';
import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useJourneyInstance from '../hooks/useJourneyInstance';
import useJourneyInstanceMutations from '../hooks/useJourneyInstanceMutations';
import useJourneys from '../hooks/useJourneys';
import { useNumericRouteParams } from 'core/hooks';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import { ZUIEllipsisMenuProps } from 'zui/ZUIEllipsisMenu';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
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

  const journeyInstanceFuture = useJourneyInstance(orgId, instanceId);
  const journeysFuture = useJourneys(orgId);

  const { updateJourneyInstance } = useJourneyInstanceMutations(
    orgId,
    instanceId
  );

  const ellipsisMenu: ZUIEllipsisMenuProps['items'] = [];

  const submenuItems =
    journeysFuture.data
      ?.filter((journey) => journey.id !== journeyId)
      .map((journey) => ({
        id: `convertTo-${journey.id}`,
        label: journey.singular_label,
        onSelect: async () => {
          //redirect to equivalent page but new journey id
          const redirectUrl = router.pathname
            .replace('[orgId]', orgId.toString())
            .replace('[journeyId]', journey.id.toString())
            .replace('[instanceId]', instanceId.toString());

          await updateJourneyInstance({ journey_id: journey.id });
          router.push(redirectUrl);
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

  const journeyInstance = journeyInstanceFuture.data;
  if (!journeyInstance) {
    return null;
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
            onChange={(newTitle) => updateJourneyInstance({ title: newTitle })}
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
