import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import useAreas from 'features/areas/hooks/useAreas';
import useServerSide from 'core/useServerSide';

const PlanMap = dynamic(
  () => import('../../../../../../../features/areas/components/PlanMap'),
  { ssr: false }
);

const scaffoldOptions = {
  authLevelRequired: 2,
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

interface PlanPageProps {
  orgId: string;
  canvassAssId: string;
}

const PlanPage: PageWithLayout<PlanPageProps> = ({ orgId }) => {
  const areas = useAreas(parseInt(orgId)).data || [];

  const isServer = useServerSide();
  if (isServer) {
    return null;
  }

  return (
    <Box height="100%">
      <PlanMap areas={areas} />
    </Box>
  );
};

PlanPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default PlanPage;
