import { FunctionComponent } from 'react';

import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import SimpleLayout from 'utils/layout/SimpleLayout';
import ThemeLayoutActionButtons from 'features/emails/components/ThemeLayoutActionButtons';

interface EmailThemeLayoutProps {
  children: React.ReactNode;
}

const EmailThemeLayout: FunctionComponent<EmailThemeLayoutProps> = ({
  children,
}) => {
  const { themeId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const title = themeId
    ? messages.themes.themeEditor.title({ themeId: themeId })
    : messages.themes.title();

  return (
    <SimpleLayout
      actionButtons={<ThemeLayoutActionButtons />}
      fixedHeight={!!themeId}
      title={title}
    >
      {children}
    </SimpleLayout>
  );
};

export default EmailThemeLayout;
