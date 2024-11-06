import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';

import AreaCard from 'features/canvassAssignments/components/AreaCard';
import { AREAS } from 'utils/featureFlags';
import CanvassAssignmentLayout from 'features/canvassAssignments/layouts/CanvassAssignmentLayout';
import { PageWithLayout } from 'utils/types';
import NumberCard from 'features/canvassAssignments/components/NumberCard';
import { scaffold } from 'utils/next';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import useCanvassAssignmentStats from 'features/canvassAssignments/hooks/useCanvassAssignmentStats';
import ZUIFutures from 'zui/ZUIFutures';
import useAssignmentAreaStats from 'features/canvassAssignments/hooks/useAssignmentAreaStats';
import useAssignmentAreaGraph from 'features/canvassAssignments/hooks/useAssignmentAreaGraph';
import { ZetkinAssignmentAreaStatsItem } from 'features/canvassAssignments/types';

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

interface CanvassAssignmentPageProps {
  orgId: string;
  canvassAssId: string;
}

const CanvassAssignmentPage: PageWithLayout<CanvassAssignmentPageProps> = ({
  orgId,
  canvassAssId,
}) => {
  const assignmentFuture = useCanvassAssignment(parseInt(orgId), canvassAssId);
  const statsFuture = useCanvassAssignmentStats(parseInt(orgId), canvassAssId);
  const areasStats = useAssignmentAreaStats(parseInt(orgId), canvassAssId);
  const dataGraph = useAssignmentAreaGraph(parseInt(orgId), canvassAssId);
  const router = useRouter();

  return (
    <ZUIFutures
      futures={{
        assignment: assignmentFuture,
        stats: statsFuture,
      }}
    >
      {({ data: { assignment, stats } }) => {
        const planUrl = `/organize/${orgId}/projects/${
          assignment.campaign.id || 'standalone'
        }/canvassassignments/${assignment.id}/plan`;
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            {stats.num_areas == 0 && (
              <Card>
                <Box p={10} sx={{ textAlign: ' center' }}>
                  <Typography>
                    This assignment has not been planned yet.
                  </Typography>
                  <Box pt={4}>
                    <Button
                      onClick={() => router.push(planUrl)}
                      startIcon={<Edit />}
                      variant="contained"
                    >
                      Plan now
                    </Button>
                  </Box>
                </Box>
              </Card>
            )}
            {stats.num_areas > 0 && (
              <>
                <Card>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    marginLeft={1}
                    maxHeight={40}
                    p={1}
                  >
                    <Typography variant="h5">Progress</Typography>
                  </Box>
                  <Divider />
                  <Box display="flex">
                    <NumberCard
                      firstNumber={stats.num_successful_visited_households}
                      message={'Successful visits'}
                      secondNumber={stats.num_visited_households}
                    />

                    <NumberCard
                      firstNumber={stats.num_visited_households}
                      message={'Households visited'}
                      secondNumber={stats.num_households}
                    />

                    <NumberCard
                      firstNumber={stats.num_visited_places}
                      message={'Places visited'}
                      secondNumber={stats.num_places}
                    />
                  </Box>
                </Card>

                <Grid container spacing={2}>
                  <ZUIFutures futures={{ areasStats, dataGraph }}>
                    {({ data: { areasStats, dataGraph } }) => {
                      // Sort areas based on successful visits only
                      const sortedAreas = areasStats.stats
                        .map((area) => {
                          const successfulVisitsTotal =
                            dataGraph
                              .find((graph) => graph.area.id === area.areaId)
                              ?.data.reduce(
                                (sum, item) => sum + item.successfulVisits,
                                0
                              ) || 0;

                          return {
                            area,
                            successfulVisitsTotal,
                          };
                        })
                        .sort(
                          (a, b) =>
                            b.successfulVisitsTotal - a.successfulVisitsTotal
                        )
                        .map(({ area }) => area);

                      const maxVisitedHouseholds = Math.max(
                        ...sortedAreas.map(
                          (area) => area.num_visited_households
                        )
                      );

                      const noAreaData = dataGraph.find(
                        (graph) => graph.area.id === 'noArea'
                      );
                      if (noAreaData && noAreaData.data.length > 0) {
                        const latestEntry = [...noAreaData.data].sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )[0];

                        const num_successful_visited_households =
                          latestEntry.successfulVisits;

                        const num_visited_households =
                          latestEntry.householdVisits;

                        const noArea: ZetkinAssignmentAreaStatsItem = {
                          areaId: 'noArea',
                          num_households: 0,
                          num_places: 0,
                          num_successful_visited_households,
                          num_visited_households,
                          num_visited_places: 0,
                        };
                        sortedAreas.push(noArea);
                      }
                      return (
                        <AreaCard
                          areas={sortedAreas}
                          assignment={assignment}
                          data={dataGraph}
                          maxVisitedHouseholds={maxVisitedHouseholds}
                        />
                      );
                    }}
                  </ZUIFutures>
                </Grid>
              </>
            )}
          </Box>
        );
      }}
    </ZUIFutures>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
