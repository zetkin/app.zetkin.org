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
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import AssigneeFilterProvider from 'features/canvassAssignments/components/OrganizerMapFilters/AssigneeFilterContext';

const OrganizerMap = dynamic(
  () =>
    import(
      '../../../../../../../features/canvassAssignments/components/OrganizerMap'
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
  const assignmentFuture = useCanvassAssignment(parseInt(orgId), canvassAssId);

  const isServer = useServerSide();
  if (isServer) {
    return null;
  }

  return (
    <Box height="100%">
      <ZUIFutures
        futures={{
          areaStats: areaStatsFuture,
          assignment: assignmentFuture,
          sessions: sessionsFuture,
        }}
      >
        {({ data: { areaStats, assignment, sessions } }) => (
          <AreaFilterProvider>
            <AssigneeFilterProvider>
              <OrganizerMap
                areas={areas}
                areaStats={areaStats}
                assignment={assignment}
                canvassAssId={canvassAssId}
                onAddAssigneeToArea={(area, person) => {
                  createCanvassSession({
                    areaId: area.id,
                    personId: person.id,
                  });
                }}
                places={places}
                sessions={sessions}
              />
            </AssigneeFilterProvider>
          </AreaFilterProvider>
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
