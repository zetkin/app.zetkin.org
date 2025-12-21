import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { VISITS } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useVisitAssignment from 'features/visitassignments/hooks/useVisitAssignment';
import VisitAssignmentTargets from 'features/visitassignments/components/VisitAssignmentTargets';
import VisitAssignmentLayout from 'features/visitassignments/layouts/VisitAssignmentLayout';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinVisitAssignment } from 'features/visitassignments/types';
import useServerSide from 'core/useServerSide';
import BackendApiClient from 'core/api/client/BackendApiClient';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [VISITS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, visitAssId } = ctx.params!;
  try {
    const client = new BackendApiClient(ctx.req.headers);

    const data = await client.get<ZetkinVisitAssignment>(
      `/beta/orgs/${orgId}/visitassignments/${visitAssId}`
    );
    const actualCampaign = data.campaign.id?.toString() ?? 'standalone';
    if (actualCampaign != campId) {
      return { notFound: true };
    }
  } catch (error) {
    return { notFound: true };
  }
  return {
    props: {},
  };
}, scaffoldOptions);

const VisitAssignmentPage: PageWithLayout = () => {
  const { orgId, visitAssId } = useNumericRouteParams();
  const onServer = useServerSide();
  const { data: visitAssignment } = useVisitAssignment(orgId, visitAssId);

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{visitAssignment?.title}</title>
      </Head>
      <Box>
        <Box mb={2}>
          <VisitAssignmentTargets assignmentId={visitAssId} orgId={orgId} />
        </Box>
      </Box>
    </>
  );
};

VisitAssignmentPage.getLayout = function getLayout(page) {
  return <VisitAssignmentLayout>{page}</VisitAssignmentLayout>;
};

export default VisitAssignmentPage;
