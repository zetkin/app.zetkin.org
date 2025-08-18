import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import useAreas from 'features/areas/hooks/useAreas';
import useServerSide from 'core/useServerSide';
import useAreaAssignees from 'features/areaAssignments/hooks/useAreaAssignees';
import { AREAS } from 'utils/featureFlags';
import useAssignmentAreaStats from 'features/areaAssignments/hooks/useAssignmentAreaStats';
import ZUIFutures from 'zui/ZUIFutures';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import AssigneeFilterProvider from 'features/areaAssignments/components/OrganizerMapFilters/AssigneeFilterContext';
import useAreaAssignmentMutations from 'features/areaAssignments/hooks/useAreaAssignmentMutations';
import { ZetkinLocation } from 'features/areaAssignments/types';

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
  areaAssId: number;
}

const OrganizerMapPage: PageWithLayout<OrganizerMapPageProps> = ({
  areaAssId,
  orgId,
}) => {
  const areas = useAreas(parseInt(orgId)).data || [];
  // TODO: Re-enable this
  //const locations = useLocations(parseInt(orgId), areaAssId).data || [];
  const locations: ZetkinLocation[] = [];
  const areaStatsFuture = useAssignmentAreaStats(parseInt(orgId), areaAssId);
  const sessionsFuture = useAreaAssignees(parseInt(orgId), areaAssId);
  const assignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);
  const { assignArea: assignUserToArea } = useAreaAssignmentMutations(
    parseInt(orgId),
    areaAssId
  );

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
            sessions: sessionsFuture,
          }}
        >
          {({ data: { areaStats, sessions } }) => (
            <AreaFilterProvider>
              <AssigneeFilterProvider>
                <OrganizerMap
                  areaAssId={areaAssId}
                  areas={areas.map((area) => ({
                    description: area.description,
                    id: area.id,
                    organization_id: area.organization_id,
                    points: area.boundary.coordinates[0],
                    tags: [],
                    title: area.title,
                  }))}
                  areaStats={areaStats}
                  locations={locations}
                  onAddAssigneeToArea={(area, user) => {
                    assignUserToArea(user.id, area.id);
                  }}
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
