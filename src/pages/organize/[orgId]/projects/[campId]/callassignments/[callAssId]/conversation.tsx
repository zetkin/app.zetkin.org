import { GetServerSideProps } from 'next';
import { Grid } from '@mui/material';
import Head from 'next/head';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallerInstructions from 'features/callAssignments/components/CallerInstructions';
import ConversationSettings from 'features/callAssignments/components/ConversationSettings';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';
import { useNumericRouteParams } from 'core/hooks';

export const getServerSideProps: GetServerSideProps = scaffold(
  async () => {
    return {
      props: {},
    };
  },
  {
    authLevelRequired: 2,
    localeScope: [
      'misc.breadcrumbs',
      'layout.organize.callAssignment',
      'pages.organizeCallAssignment',
    ],
  }
);

const ConversationPage: PageWithLayout = () => {
  const { orgId, callAssId } = useNumericRouteParams();
  const { data } = useCallAssignment(orgId, callAssId);

  return (
    <>
      <Head>
        <title>{data?.title}</title>
      </Head>
      <Grid container spacing={2}>
        <Grid item lg={8} md={6} sm={12}>
          <CallerInstructions assignmentId={callAssId} orgId={orgId} />
        </Grid>
        <Grid item lg={4} md={6} sm={12}>
          <ConversationSettings assignmentId={callAssId} orgId={orgId} />
        </Grid>
      </Grid>
    </>
  );
};

ConversationPage.getLayout = function getLayout(page) {
  return <CallAssignmentLayout>{page}</CallAssignmentLayout>;
};

export default ConversationPage;
