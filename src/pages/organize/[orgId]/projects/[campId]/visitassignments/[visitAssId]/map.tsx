import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import VisitAssignmentLayout from 'features/visitassignments/layouts/VisitAssignmentLayout';
import useAreas from 'features/areas/hooks/useAreas';
import useServerSide from 'core/useServerSide';
import { VISITS } from 'utils/featureFlags';
import useVisitAssignmentStats from 'features/visitassignments/hooks/useVisitAssignmentStats';
import ZUIFutures from 'zui/ZUIFutures';
import useVisitAssignment from 'features/visitassignments/hooks/useVisitAssignment';
import { useNumericRouteParams } from 'core/hooks';
import useVisitTargets from 'features/visitassignments/hooks/useVisitTargets';

const OrganizerMap = dynamic(
  () => import('features/visitassignments/components/OrganizerMap'),
  { ssr: false }
);

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [VISITS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, visitAssId } = ctx.params!;

  return {
    props: {
      assignmentId: visitAssId,
      campId,
      orgId,
    },
  };
}, scaffoldOptions);

interface OrganizerMapPageProps {
  orgId: string;
  visitAssId: number;
}

const OrganizerMapPage: PageWithLayout<OrganizerMapPageProps> = () => {
  const { orgId, visitAssId } = useNumericRouteParams();
  const onServer = useServerSide();
  const areas = useAreas(orgId).data || [];
  const targets = useVisitTargets(orgId, visitAssId).data || [];
  const visitStatsFuture = useVisitAssignmentStats(orgId, visitAssId);
  const assignmentFuture = useVisitAssignment(orgId, visitAssId);

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{assignmentFuture.data?.title}</title>
      </Head>
      <Box height="100%">
        <ZUIFutures
          futures={{
            areaStats: visitStatsFuture,
          }}
        >
          <OrganizerMap
            areas={areas.map((area) => ({
              description: area.description,
              id: area.id,
              organization_id: area.organization_id,
              points: area.boundary.coordinates[0],
              tags: [],
              title: area.title,
            }))}
            targets={targets}
            visitAssId={visitAssId}
          />
        </ZUIFutures>
      </Box>
    </>
  );
};

OrganizerMapPage.getLayout = function getLayout(page) {
  return <VisitAssignmentLayout {...page.props}>{page}</VisitAssignmentLayout>;
};

export default OrganizerMapPage;
