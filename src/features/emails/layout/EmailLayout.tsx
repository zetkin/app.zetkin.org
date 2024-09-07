import { FC } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { People } from '@mui/icons-material';

import DeliveryStatusMessage from '../components/DeliveryStatusMessage';
import EmailActionButtons from '../components/EmailActionButtons';
import EmailStatusChip from '../components/EmailStatusChip';
import messageIds from '../l10n/messageIds';
import TabbedLayout from '../../../utils/layout/TabbedLayout';
import useEmail from '../hooks/useEmail';
import useEmailStats from '../hooks/useEmailStats';
import useEmailThemes from '../hooks/useEmailThemes';
import { useNumericRouteParams } from 'core/hooks';
import useOrganization from 'features/organizations/hooks/useOrganization';
import ZUIEditTextinPlace from 'zui/ZUIEditTextInPlace';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';
import useEmailState, { EmailState } from '../hooks/useEmailState';

interface EmailLayoutProps {
  children: React.ReactNode;
  fixedHeight?: boolean;
}

const EmailLayout: FC<EmailLayoutProps> = ({
  children,
  fixedHeight = false,
}) => {
  const { orgId, campId, emailId } = useNumericRouteParams();
  const router = useRouter();
  const messages = useMessages(messageIds);
  const { data: email, updateEmail } = useEmail(orgId, emailId);
  const emailStatsFuture = useEmailStats(orgId, emailId);
  const emailState = useEmailState(orgId, emailId);
  const organization = useOrganization(orgId).data;
  const themes = useEmailThemes(orgId).data || [];

  if (!email || !organization) {
    return null;
  }

  return (
    <>
      <TabbedLayout
        actionButtons={
          <EmailActionButtons email={email} orgId={orgId} state={emailState} />
        }
        baseHref={`/organize/${orgId}/projects/${campId}/emails/${emailId}`}
        belowActionButtons={
          emailState !== EmailState.SENT ? (
            <DeliveryStatusMessage email={email} />
          ) : undefined
        }
        defaultTab="/"
        fixedHeight={fixedHeight}
        subtitle={
          <Box alignItems="center" display="flex">
            <Box marginRight={1}>
              <EmailStatusChip state={emailState} />
            </Box>
            <Box display="flex" marginX={1}>
              <ZUIFuture
                future={emailStatsFuture}
                ignoreDataWhileLoading
                skeletonWidth={100}
              >
                {(emailStats) => (
                  <>
                    <People />
                    <Typography marginLeft={1}>
                      {emailStats.num_locked_targets === null ? (
                        <Msg
                          id={messageIds.stats.targets}
                          values={{ numTargets: emailStats.num_target_matches }}
                        />
                      ) : (
                        <Msg
                          id={messageIds.stats.lockedTargets}
                          values={{
                            numLocked:
                              emailStats.num_target_matches -
                              emailStats.num_blocked.any,
                          }}
                        />
                      )}
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
            href: '/compose',
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
      <Dialog open={!organization.email || themes.length == 0}>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={2}
          justifyContent="center"
          padding={2}
        >
          <Typography>
            <Msg id={messageIds.emailFeatureIsBlocked.errorMessage} />
          </Typography>
          <Button
            onClick={() => {
              router.back();
            }}
            variant="contained"
          >
            <Msg id={messageIds.emailFeatureIsBlocked.goBackButton} />
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default EmailLayout;
