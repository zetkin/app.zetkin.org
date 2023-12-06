import Head from 'next/head';
import { Box, Typography } from '@mui/material';

import EmailLayout from 'features/emails/layout/EmailLayout';
import { GetServerSideProps } from 'next';
import { PageWithLayout } from 'utils/types';
// import { useNumericRouteParams } from 'core/hooks';
// import { Msg } from 'core/i18n';
import { scaffold } from 'utils/next';
import useServerSide from 'core/useServerSide';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, emailId } = ctx.params!;

    return {
      props: {
        campId,
        emailId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: ['layout.organize.email', 'pages.organizeEmail'],
  }
);

const EmailPage: PageWithLayout = () => {
  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>email</title>
      </Head>
      <Box>
        <Box mb={2}>
          <h1>what?</h1>
          {/* <CallAssignmentTargets assignmentId={callAssId} orgId={orgId} /> */}
        </Box>
        <Box mb={2}>
          <Typography variant="h3">
            {/* <Msg id={messageIds.statusSectionTitle} /> */}
            yo
          </Typography>
        </Box>
        {/* <ZUIStackedStatusBar values={statusBarStatsList} /> */}
        <Box mt={2}>
          {/* <CallAssignmentStatusCards assignmentId={callAssId} orgId={orgId} /> */}
        </Box>
      </Box>
    </>
  );
};

EmailPage.getLayout = function getLayout(page) {
  return <EmailLayout>{page}</EmailLayout>;
};

export default EmailPage;
