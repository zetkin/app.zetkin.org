import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { HOUSEHOLDS2 } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useHouseholdAssignment from 'features/householdsAssignments/hooks/useHouseholdAssignment';
import HouseholdsAssignmentTargets from 'features/householdsAssignments/components/HouseholdsAssignmentTargets';
import HouseholdAssignmentLayout from 'features/householdsAssignments/layouts/HouseholdAssignmentLayout';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinHouseholdAssignment } from 'features/householdsAssignments/types';
import useServerSide from 'core/useServerSide';
import BackendApiClient from '../../../../../../../core/api/client/BackendApiClient';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [HOUSEHOLDS2],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, householdsAssId } = ctx.params!;
  try {
    const client = new BackendApiClient(ctx.req.headers);

    const data = await client.get<ZetkinHouseholdAssignment>(
      `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}`
    );
    const actualCampaign = data.campId?.toString() ?? 'standalone';
    if (actualCampaign !== campId) {
      return { notFound: true };
    }
  } catch (error) {
    return { notFound: true };
  }
  return {
    props: {},
  };
}, scaffoldOptions);

const HouseholdsAssignmentPage: PageWithLayout = () => {
  const { orgId, campId, householdsAssId } = useNumericRouteParams();
  const onServer = useServerSide();
  const { data: householdsAssignment } = useHouseholdAssignment(
    campId,
    orgId,
    householdsAssId
  );

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{householdsAssignment?.title}</title>
      </Head>
      <Box>
        <Box mb={2}>
          <HouseholdsAssignmentTargets
            assignmentId={householdsAssId}
            campId={campId}
            orgId={orgId}
          />
        </Box>
      </Box>
    </>
  );
};

HouseholdsAssignmentPage.getLayout = function getLayout(page) {
  return <HouseholdAssignmentLayout>{page}</HouseholdAssignmentLayout>;
};

export default HouseholdsAssignmentPage;
