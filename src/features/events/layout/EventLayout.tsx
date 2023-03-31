import { Box } from '@mui/material';
import TabbedLayout from 'utils/layout/TabbedLayout';

import EventDataModel from '../models/EventDataModel';
import EventStatusChip from '../components/EventStatusChip';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';

interface EventLayoutProps {
  children: React.ReactNode;
  eventId: string;
  orgId: string;
  campaignId: string;
}

const EventLayout: React.FC<EventLayoutProps> = ({
  children,
  eventId,
  orgId,
  campaignId,
}) => {
  const messages = useMessages(messageIds);

  const model = useModel(
    (env) => new EventDataModel(env, parseInt(orgId), parseInt(eventId))
  );

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/projects/${campaignId}/events/${eventId}`}
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <EventStatusChip state={model.state} />
        </Box>
      }
      tabs={[
        { href: '/', label: messages.tabs.overview() },
        {
          href: '/participants',
          label: messages.tabs.participants(),
        },
      ]}
      title={
        <ZUIFuture future={model.getData()}>
          {(data) => {
            return (
              <ZUIEditTextinPlace
                onChange={(val) => {
                  model.setTitle(val);
                }}
                value={data.title || data.activity.title}
              />
            );
          }}
        </ZUIFuture>
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default EventLayout;
