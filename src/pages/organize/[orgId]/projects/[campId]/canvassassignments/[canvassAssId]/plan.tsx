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
import useCreateCanvassSession from 'features/canvassAssignments/hooks/useCreateCanvassSession';
import { AREAS } from 'utils/featureFlags';
import usePlaces from 'features/canvassAssignments/hooks/usePlaces';
import useAssignmentAreaStats from 'features/canvassAssignments/hooks/useAssignmentAreaStats';
import ZUIFutures from 'zui/ZUIFutures';

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
  const places = usePlaces(parseInt(orgId)).data || [];
  const areaStatsFuture = useAssignmentAreaStats(parseInt(orgId), canvassAssId);
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
      <ZUIFutures
        futures={{ areaStats: areaStatsFuture, sessions: sessionsFuture }}
      >
        {({ data: { areaStats, sessions } }) => (
          <PlanMap
            areas={areas}
            areaStats={areaStats}
            onAddAssigneeToArea={(area, person) => {
              createCanvassSession({
                areaId: area.id,
                personId: person.id,
              });
            }}
            places={places}
            sessions={sessions}
          />
        )}
      </ZUIFutures>
    </Box>
  );
};

PlanPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default PlanPage;
