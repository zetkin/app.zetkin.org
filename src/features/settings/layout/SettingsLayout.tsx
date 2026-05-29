import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: FunctionComponent<SettingsLayoutProps> = ({
  children,
}) => {
  const { orgId } = useRouter().query;
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/settings`}
      defaultTab="/"
      tabs={[
        { href: `/`, label: messages.settingsLayout.access() },
        { href: `/fields`, label: messages.settingsLayout.fields() },
        { href: '/email', label: messages.settingsLayout.email() },
      ]}
      title={messages.settingsLayout.title()}
    >
      {children}
    </TabbedLayout>
  );
};

export default SettingsLayout;
