import { FunctionComponent } from 'react';

import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';
import { EMAIL_SETTINGS } from 'utils/featureFlags';
import useFeature from 'utils/featureFlags/useFeature';
import { useNumericRouteParams } from 'core/hooks';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout: FunctionComponent<SettingsLayoutProps> = ({
  children,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);

  const hasEmailSettingsFeautre = useFeature(EMAIL_SETTINGS, orgId);

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/settings`}
      defaultTab="/"
      tabs={[
        { href: `/`, label: messages.settingsLayout.access() },
        { href: `/fields`, label: messages.settingsLayout.fields() },
        ...(hasEmailSettingsFeautre
          ? [{ href: '/email', label: messages.settingsLayout.email() }]
          : []),
      ]}
      title={messages.settingsLayout.title()}
    >
      {children}
    </TabbedLayout>
  );
};

export default SettingsLayout;
