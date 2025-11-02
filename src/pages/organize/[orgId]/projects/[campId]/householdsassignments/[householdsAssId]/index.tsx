import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { HOUSEHOLDS2 } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useHouseholdAssignment from 'features/householdsAssignments/hooks/useHouseholdAssignment';
import HouseholdsAssignmentTargets from 'features/householdsAssignments/components/HouseholdsAssignmentTargets';
import HouseholdAssignmentLayout from 'features/householdsAssignments/layouts/HouseholdAssignmentLayout';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [HOUSEHOLDS2],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, householdsAssId } = ctx.params!;
  return {
    props: { campId, householdsAssId, orgId },
  };
}, scaffoldOptions);

interface HouseholdsAssignmentPageProps {
  campId: string;
  householdsAssId: string;
  orgId: string;
}

const HouseholdsAssignmentPage: PageWithLayout<
  HouseholdsAssignmentPageProps
> = ({ campId, orgId, householdsAssId }) => {
  const assignmentFuture = useHouseholdAssignment(
    parseInt(campId),
    parseInt(orgId),
    parseInt(householdsAssId)
  );

  return (
    <>
      <Head>
        <title>{assignmentFuture.data?.title}</title>
      </Head>
      <Box>
        <Box mb={2}>
          <HouseholdsAssignmentTargets assignmentId={parseInt(householdsAssId)} campId={parseInt(campId)} orgId={parseInt(orgId)} />
        </Box>
      </Box>
    </>
  );
};

HouseholdsAssignmentPage.getLayout = function getLayout(page) {
  return (
    <HouseholdAssignmentLayout {...page.props}>
      {page}
    </HouseholdAssignmentLayout>
  );
};

export default HouseholdsAssignmentPage;
