import { FunctionComponent } from 'react';

import messageIds from 'features/settings/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import SimpleLayout from 'utils/layout/SimpleLayout';

interface EmailThemeLayoutProps {
  children: React.ReactNode;
}

const EmailThemeLayout: FunctionComponent<EmailThemeLayoutProps> = ({
  children,
}) => {
  const { themeId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const title = themeId
    ? messages.email.themes.themeEditor.title({ themeId: themeId })
    : messages.email.themes.title();

  return (
    <SimpleLayout fixedHeight={true} title={title}>
      {children}
    </SimpleLayout>
  );
};

export default EmailThemeLayout;
