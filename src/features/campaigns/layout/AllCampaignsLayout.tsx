import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface AllCampaignsLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const AllCampaignsLayout: FunctionComponent<AllCampaignsLayoutProps> = ({
  children,
  fixedHeight,
}) => {
  const { orgId } = useRouter().query;
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/campaigns`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      tabs={[
        { href: `/`, messageId: 'layout.organize.campaigns.summary' },
        {
          href: `/calendar`,
          messageId: 'layout.organize.campaigns.calendar',
        },
      ]}
      title={messages.layout.allCampaigns()}
    >
      {children}
    </TabbedLayout>
  );
};

export default AllCampaignsLayout;
