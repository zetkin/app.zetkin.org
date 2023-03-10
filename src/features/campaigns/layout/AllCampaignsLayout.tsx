import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import CampaignsActionButtons from '../components/CampaignsActionButtons';
import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';

import { useMessages } from 'core/i18n';

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
      actionButtons={<CampaignsActionButtons />}
      baseHref={`/organize/${orgId}/campaigns`}
      defaultTab="/"
      fixedHeight={fixedHeight}
      tabs={[
        { href: `/`, label: messages.layout.summary() },
        {
          href: `/calendar`,
          label: messages.layout.calendar(),
        },
      ]}
      title={messages.layout.allCampaigns()}
    >
      {children}
    </TabbedLayout>
  );
};

export default AllCampaignsLayout;
