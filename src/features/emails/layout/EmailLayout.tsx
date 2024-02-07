import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import EmailActionButtons from '../components/EmailActionButtons';
import EmailStatusChip from '../components/EmailStatusChip';
import messageIds from '../l10n/messageIds';
import { People } from '@mui/icons-material';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useEmail from '../hooks/useEmail';
import useEmailState from '../hooks/useEmailState';
import useEmailTargets from '../hooks/useEmailTargets';
import { useNumericRouteParams } from 'core/hooks';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';

interface EmailLayoutProps {
  children: React.ReactNode;
}

const EmailLayout: FC<EmailLayoutProps> = ({ children }) => {
  const { orgId, campId, emailId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const { data: email, updateEmail } = useEmail(orgId, emailId);
  const targetsFuture = useEmailTargets(orgId, emailId);
  const emailState = useEmailState(orgId, emailId);
  if (!email) {
    return null;
  }

  return (
    <TabbedLayout
      actionButtons={
        <EmailActionButtons
          email={email}
          emailState={emailState}
          orgId={orgId}
        />
      }
      baseHref={`/organize/${orgId}/projects/${campId}/emails/${emailId}`}
      defaultTab="/"
      fixedHeight
      subtitle={
        <Box alignItems="center" display="flex">
          <Box marginRight={1}>
            <EmailStatusChip state={emailState} />
          </Box>
          <Box display="flex" marginX={1}>
            <ZUIFuture
              future={targetsFuture}
              ignoreDataWhileLoading
              skeletonWidth={100}
            >
              {(data) => (
                <>
                  <People />
                  <Typography marginLeft={1}>
                    <Msg
                      id={messageIds.stats.targets}
                      values={{ numTargets: data.allTargets }}
                    />
                  </Typography>
                </>
              )}
            </ZUIFuture>
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
          label: messages.tabs.compose(),
        },
      ]}
      title={
        <ZUIEditTextinPlace
          onChange={(newTitle) => {
            updateEmail({ title: newTitle });
          }}
          value={email.title || ''}
        />
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default EmailLayout;
