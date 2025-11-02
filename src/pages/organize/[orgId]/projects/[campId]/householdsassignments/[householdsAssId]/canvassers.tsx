import { Close } from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  Box,
  Fade,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { HOUSEHOLDS2 } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import HouseholdAssignmentLayout
  from 'features/householdsAssignments/layouts/HouseholdAssignmentLayout';
import { useNumericRouteParams } from '../../../../../../../core/hooks';
import useServerSide from '../../../../../../../core/useServerSide';
import useHouseholdAssignment from '../../../../../../../features/householdsAssignments/hooks/useHouseholdAssignment';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [HOUSEHOLDS2],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, householdsAssId } = ctx.params!;

  return {
    props: {
      assignmentId: householdsAssId,
      campId,
      orgId,
    }
  };
}, scaffoldOptions);

const CanvassersPage: PageWithLayout = () => {
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
    </>
  );
};

CanvassersPage.getLayout = function getLayout(page) {
  return <HouseholdAssignmentLayout>{page}</HouseholdAssignmentLayout>
};

export default CanvassersPage;
