import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import CanvassAssignmentLayout from 'features/canvassAssignments/layouts/CanvassAssignmentLayout';
import useAreas from 'features/areas/hooks/useAreas';
import useServerSide from 'core/useServerSide';
import useCanvassSessions from 'features/canvassAssignments/hooks/useCanvassSessions';
import ZUIFuture from 'zui/ZUIFuture';
import useCreateCanvassSession from 'features/canvassAssignments/hooks/useCreateCanvassSession';
import { AREAS } from 'utils/featureFlags';

const PlanMap = dynamic(
  () =>
    import(
      '../../../../../../../features/canvassAssignments/components/PlanMap'
    ),
  { ssr: false }
);

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [AREAS],
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

const PlanPage: PageWithLayout<PlanPageProps> = ({ canvassAssId, orgId }) => {
  const areas = useAreas(parseInt(orgId)).data || [];
  const sessionsFuture = useCanvassSessions(parseInt(orgId), canvassAssId);
  const createCanvassSession = useCreateCanvassSession(
    parseInt(orgId),
    canvassAssId
  );

  const isServer = useServerSide();
  if (isServer) {
    return null;
  }

  return (
    <Box height="100%">
      <ZUIFuture future={sessionsFuture}>
        {(sessions) => (
          <PlanMap
            areas={areas}
            onAddAssigneeToArea={(area, person) => {
              createCanvassSession({
                areaId: area.id,
                personId: person.id,
              });
            }}
            sessions={sessions}
          />
        )}
      </ZUIFuture>
    </Box>
  );
};

PlanPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default PlanPage;
