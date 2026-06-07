import { FunctionComponent } from 'react';

import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';
import { EMAIL_SETTINGS, JOURNEYS_SETTINGS } from 'utils/featureFlags';
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

  const hasEmailSettingsFeature = useFeature(EMAIL_SETTINGS, orgId);
  const hasJourneySettingsFeature = useFeature(JOURNEYS_SETTINGS, orgId);

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/settings`}
      defaultTab="/"
      tabs={[
        { href: `/`, label: messages.settingsLayout.access() },
        { href: `/fields`, label: messages.settingsLayout.fields() },
        ...(hasEmailSettingsFeature
          ? [{ href: '/email', label: messages.settingsLayout.email() }]
          : []),
        ...(hasJourneySettingsFeature
          ? [{ href: '/journeys', label: messages.settingsLayout.journeys() }]
          : []),
      ]}
      title={messages.settingsLayout.title()}
    >
      {children}
    </TabbedLayout>
  );
};

export default SettingsLayout;
