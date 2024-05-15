import { Button } from '@mui/material';
import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { Msg, useMessages } from 'core/i18n';

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
      actionButtons={
        <Button disabled variant="contained">
          <Msg id={messageIds.save} />
        </Button>
      }
      baseHref={`/organize/${orgId}/settings`}
      defaultTab="/"
      ellipsisMenuItems={[
        {
          label: '',
        },
      ]}
      tabs={[{ href: `/`, label: messages.settingsLayout.access() }]}
      title={messages.settingsLayout.title()}
    >
      {children}
    </TabbedLayout>
  );
};

export default SettingsLayout;
