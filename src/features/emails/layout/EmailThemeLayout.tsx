import { FunctionComponent } from 'react';

import messageIds from 'features/emails/l10n/messageIds';
import TabbedLayout from 'utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const EmailThemeLayout: FunctionComponent<SettingsLayoutProps> = ({
  children,
}) => {
  const { orgId, themeId } = useNumericRouteParams();
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/settings/themes/${themeId}`}
      defaultTab="/frame"
      tabs={[
        { href: `/frame`, label: messages.themes.editor.tabs.frame() },
        { href: `/css`, label: messages.themes.editor.tabs.css() },
        {
          href: `/block_attributes`,
          label: messages.themes.editor.tabs.block(),
        },
      ]}
      title={messages.themes.editor.title({ themeId: themeId })}
    >
      {children}
    </TabbedLayout>
  );
};

export default EmailThemeLayout;
