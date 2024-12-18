import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import useAreas from 'features/geography/hooks/useAreas';
import useServerSide from 'core/useServerSide';
import useAreaAssignmentSessions from 'features/areaAssignments/hooks/useAreaAssignmentSessions';
import useCreateAreaAssignmentSession from 'features/areaAssignments/hooks/useCreateAreaAssigneeSession';
import { AREAS } from 'utils/featureFlags';
import usePlaces from 'features/areaAssignments/hooks/usePlaces';
import useAssignmentAreaStats from 'features/areaAssignments/hooks/useAssignmentAreaStats';
import ZUIFutures from 'zui/ZUIFutures';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import AreaFilterProvider from 'features/geography/components/AreaFilters/AreaFilterContext';
import AssigneeFilterProvider from 'features/areaAssignments/components/OrganizerMapFilters/AssigneeFilterContext';

const OrganizerMap = dynamic(
  () =>
    import(
      '../../../../../../../features/areaAssignments/components/OrganizerMap'
    ),
  { ssr: false }
);

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [AREAS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, areaAssId } = ctx.params!;
  return {
    props: { areaAssId, campId, orgId },
  };
}, scaffoldOptions);

interface OrganizerMapPageProps {
  orgId: string;
  areaAssId: string;
}

const OrganizerMapPage: PageWithLayout<OrganizerMapPageProps> = ({
  areaAssId,
  orgId,
}) => {
  const areas = useAreas(parseInt(orgId)).data || [];
  const places = usePlaces(parseInt(orgId)).data || [];
  const areaStatsFuture = useAssignmentAreaStats(parseInt(orgId), areaAssId);
  const sessionsFuture = useAreaAssignmentSessions(parseInt(orgId), areaAssId);
  const createAreaAssignmentSession = useCreateAreaAssignmentSession(
    parseInt(orgId),
    areaAssId
  );
  const assignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);

  const isServer = useServerSide();
  if (isServer) {
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
            areaStats: areaStatsFuture,
            assignment: assignmentFuture,
            sessions: sessionsFuture,
          }}
        >
          {({ data: { areaStats, assignment, sessions } }) => (
            <AreaFilterProvider>
              <AssigneeFilterProvider>
                <OrganizerMap
                  areaAssId={areaAssId}
                  areas={areas}
                  areaStats={areaStats}
                  assignment={assignment}
                  onAddAssigneeToArea={(area, person) => {
                    createAreaAssignmentSession({
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
    </>
  );
};

OrganizerMapPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default OrganizerMapPage;
