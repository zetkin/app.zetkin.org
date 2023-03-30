import { Box } from '@mui/material';
import TabbedLayout from 'utils/layout/TabbedLayout';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

interface SurveyLayoutProps {
  children: React.ReactNode;
  eventId: string;
  orgId: string;
  campaignId: string;
}

const EventLayout: React.FC<SurveyLayoutProps> = ({
  children,
  eventId,
  orgId,
  campaignId,
}) => {
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/projects/${campaignId}/events/${eventId}`}
      defaultTab="/"
      subtitle={<Box alignItems="center" display="flex"></Box>}
      tabs={[
        { href: '/', label: messages.tabs.overview() },
        {
          href: '/participants',
          label: messages.tabs.participants(),
        },
      ]}
    >
      {children}
    </TabbedLayout>
  );
};

export default EventLayout;
