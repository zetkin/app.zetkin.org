import { Box } from '@mui/material';
import { FC } from 'react';

import EmailActionButtons from '../components/EmailActionButtons';
import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';

interface EmailLayoutProps {
  children: React.ReactNode;
}

const EmailLayout: FC<EmailLayoutProps> = ({ children }) => {
  const { orgId, campId, emailId } = useNumericRouteParams();
  const messages = useMessages(messageIds);

  return (
    <TabbedLayout
      actionButtons={<EmailActionButtons />}
      baseHref={`/organize/${orgId}/projects/${campId}/emails/${emailId}`}
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
        {
          href: '/editorTest',
          label: 'Editor test',
        },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={() => {
            //Haeju has made this
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
