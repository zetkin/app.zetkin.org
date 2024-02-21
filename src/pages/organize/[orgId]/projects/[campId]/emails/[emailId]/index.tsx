import { Box } from '@mui/material';
import Head from 'next/head';

import EmailLayout from 'features/emails/layout/EmailLayout';
import EmailTargets from 'features/emails/components/EmailTargets';
import EmailTargetsReady from 'features/emails/components/EmailTargetsReady';
import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useEmail from 'features/emails/hooks/useEmail';
import useEmailTargets from 'features/emails/hooks/useEmailTargets';
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
  const { data: targets } = useEmailTargets(orgId, emailId);

  const onServer = useServerSide();

  if (onServer || !email) {
    return null;
  }

  const isLocked = !!email.locked;

  //TODO: Get real stats from API
  const readyTargets = 230;

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
            targets={targets}
            updateTargets={updateTargets}
          />
          <Box display="flex" gap={2} paddingTop={2}>
            <EmailTargetsReady
              isLoading={mutating.includes('lock')}
              isLocked={isLocked}
              isTargeted={isTargeted}
              onToggleLocked={() => updateEmail({ lock: !email.locked })}
              readyTargets={readyTargets}
            />
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
