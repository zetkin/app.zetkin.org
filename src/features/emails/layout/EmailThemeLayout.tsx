import { FunctionComponent } from 'react';

import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import SimpleLayout from 'utils/layout/SimpleLayout';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const EmailThemeLayout: FunctionComponent<SettingsLayoutProps> = ({
  children,
}) => {
  const { themeId } = useNumericRouteParams();
  const messages = useMessages(messageIds);

  return (
    <SimpleLayout
      title={messages.themes.themeEditor.title({ themeId: themeId })}
    >
      {children}
    </SimpleLayout>
  );
};

export default EmailThemeLayout;
