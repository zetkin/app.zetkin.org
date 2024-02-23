import { Box } from '@mui/material';
import Head from 'next/head';

import EmailLayout from 'features/emails/layout/EmailLayout';
import EmailTargets from 'features/emails/components/EmailTargets';
import EmailTargetsBlocked from 'features/emails/components/EmailTargetsBlocked';
import EmailTargetsReady from 'features/emails/components/EmailTargetsReady';
import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailStats from 'features/emails/hooks/useEmailStats';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.email', 'pages.organizeEmail'],
  }
);

const EmailPage: PageWithLayout = () => {
  const { orgId, emailId } = useNumericRouteParams();
  const {
    data: email,
    isTargeted,
    mutating,
    updateEmail,
    updateTargets,
  } = useEmail(orgId, emailId);
  const {
    data: emailStats,
    readyTargets,
    lockedTargets,
  } = useEmailStats(orgId, emailId);

  const onServer = useServerSide();

  if (onServer || !email) {
    return null;
  }

  const isLocked = !!email.locked;

  return (
    <>
      <Head>
        <title>{email.title}</title>
      </Head>
      <Box>
        <Box display="flex" flexDirection="column">
          <EmailTargets
            email={email}
            isLocked={isLocked}
            isTargeted={isTargeted}
            targets={emailStats?.num_target_matches ?? 0}
            updateTargets={updateTargets}
          />
          <Box display="flex" gap={2} paddingTop={2}>
            <Box flex={1}>
              <EmailTargetsBlocked
                blacklisted={emailStats?.num_blocked?.blacklisted || 0}
                missingEmail={emailStats?.num_blocked?.no_email || 0}
                total={emailStats?.num_blocked.any ?? 0}
                unsubscribed={emailStats?.num_blocked?.unsubscribed || 0}
              />
            </Box>
            <Box flex={1}>
              <EmailTargetsReady
                isLoading={mutating.includes('lock')}
                isLocked={isLocked}
                isTargeted={isTargeted}
                lockedTargets={lockedTargets}
                onToggleLocked={() => updateEmail({ lock: !email.locked })}
                readyTargets={readyTargets}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

EmailPage.getLayout = function getLayout(page) {
  return <EmailLayout>{page}</EmailLayout>;
};

export default EmailPage;
