import { FunctionComponent } from 'react';

import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import SimpleLayout from 'utils/layout/SimpleLayout';
import ThemesActionButtons from 'features/emails/components/ThemesActionButtons';

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
    <SimpleLayout actionButtons={<ThemesActionButtons />} title={title}>
      {children}
    </SimpleLayout>
  );
};

export default EmailThemeLayout;
