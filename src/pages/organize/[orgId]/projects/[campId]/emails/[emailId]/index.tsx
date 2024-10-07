import { Box } from '@mui/material';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import EmailLayout from 'features/emails/layout/EmailLayout';
import EmailTargets from 'features/emails/components/EmailTargets';
import EmailTargetsBlocked from 'features/emails/components/EmailTargetsBlocked';
import EmailTargetsReady from 'features/emails/components/EmailTargetsReady';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailState from 'features/emails/hooks/useEmailState';
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
  const { numBlocked, numTargetMatches, readyTargets, lockedReadyTargets } =
    useEmailStats(orgId, emailId);
  const emailState = useEmailState(orgId, emailId);

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
            state={emailState}
            targets={numTargetMatches}
            updateTargets={updateTargets}
          />
          <Box display="flex" gap={2} paddingTop={2}>
            <Box flex={1}>
              <EmailTargetsBlocked
                blacklisted={numBlocked.blacklisted}
                missingEmail={numBlocked.noEmail}
                total={numBlocked.any}
                unsubscribed={numBlocked.unsubscribed}
              />
            </Box>
            <Box flex={1}>
              <EmailTargetsReady
                isLoading={mutating.includes('locked')}
                isLocked={isLocked}
                isTargeted={isTargeted}
                lockedReadyTargets={lockedReadyTargets}
                onToggleLocked={() => updateEmail({ locked: !email.locked })}
                readyTargets={readyTargets}
                state={emailState}
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
