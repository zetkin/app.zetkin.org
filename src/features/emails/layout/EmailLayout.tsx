import { Box } from '@mui/material';
import { FC } from 'react';

import EmailActionButtons from '../components/EmailActionButtons';
import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';

interface EmailLayoutProps {
  children: React.ReactNode;
}

const EmailLayout: FC<EmailLayoutProps> = ({ children }) => {
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      actionButtons={<EmailActionButtons />}
      baseHref={`/`}
      defaultTab="/"
      subtitle={<Box alignItems="center" display="flex" />}
      tabs={[
        {
          href: '/',
          label: messages.tabs.overview(),
        },
        {
          href: '/design',
          label: messages.tabs.design(),
        },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={() => {
            // Do nothing for now
          }}
          value={'default'}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default EmailLayout;
