import { Box, Grid } from '@mui/material';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import EmailLayout from 'features/emails/layout/EmailLayout';
import EmailTargets from 'features/emails/components/EmailTargets';
import EmailTargetsBlocked from 'features/emails/components/EmailTargetsBlocked';
import EmailTargetsReady from 'features/emails/components/EmailTargetsReady';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailState, { EmailState } from 'features/emails/hooks/useEmailState';
import useEmailStats from 'features/emails/hooks/useEmailStats';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import EmailURLCard from 'features/emails/components/EmailURLCard';

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
        <Grid container spacing={2}>
          <Grid size={{ md: 8 }}>
            <EmailTargets
              email={email}
              isLoading={mutating.includes('locked')}
              isLocked={isLocked}
              isTargeted={isTargeted}
              onToggleLocked={() => updateEmail({ locked: !email.locked })}
              readyTargets={readyTargets}
              state={emailState}
              targets={numTargetMatches}
              updateTargets={updateTargets}
            />
          </Grid>
          <Grid size={{ md: 4 }}>
            <EmailURLCard
              emailId={emailId}
              isOpen={emailState == EmailState.SENT}
              orgId={orgId}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <EmailTargetsBlocked
              blacklisted={numBlocked.blacklisted}
              missingEmail={numBlocked.noEmail}
              total={numBlocked.any}
              unsubscribed={numBlocked.unsubscribed}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <EmailTargetsReady
              lockedReadyTargets={lockedReadyTargets}
              missingEmail={numBlocked.noEmail}
              readyTargets={readyTargets}
              state={emailState}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

EmailPage.getLayout = function getLayout(page) {
  return <EmailLayout>{page}</EmailLayout>;
};

export default EmailPage;
