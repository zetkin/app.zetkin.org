import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import EmailActionButtons from '../components/EmailActionButtons';
import messageIds from '../l10n/messageIds';
import { People } from '@mui/icons-material';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import { useNumericRouteParams } from 'core/hooks';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import EmailStatusChip, { EmailState } from '../components/EmailStatusChip';
import { Msg, useMessages } from 'core/i18n';

interface EmailLayoutProps {
  children: React.ReactNode;
}

const EmailLayout: FC<EmailLayoutProps> = ({ children }) => {
  const { orgId, campId, emailId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  //const emailFuture = useEmail()
  //const emailState = useEmailState()

  return (
    <TabbedLayout
      actionButtons={<EmailActionButtons />}
      baseHref={`/organize/${orgId}/projects/${campId}/emails/${emailId}`}
      defaultTab="/"
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            {/* emailState here*/}
            <EmailStatusChip state={EmailState.DRAFT} />
          </Box>
          <Box display="flex" marginX={1}>
            <People />
            <Typography marginLeft={1}>
              <Msg id={messageIds.stats.targets} values={{ numTargets: 0 }} />
            </Typography>
          </Box>
        </Box>
      }
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
          onChange={() => console.log('hey')}
          value={'default'}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default EmailLayout;
