import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';

import AreaCard from 'features/areaAssignments/components/AreaCard';
import { AREAS } from 'utils/featureFlags';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import { PageWithLayout } from 'utils/types';
import NumberCard from 'features/areaAssignments/components/NumberCard';
import { scaffold } from 'utils/next';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import useAreaAssignmentStats from 'features/areaAssignments/hooks/useAreaAssignmentStats';
import ZUIFutures from 'zui/ZUIFutures';
import useAssignmentAreaStats from 'features/areaAssignments/hooks/useAssignmentAreaStats';
import useAssignmentAreaGraph from 'features/areaAssignments/hooks/useAssignmentAreaGraph';
import { ZetkinAssignmentAreaStatsItem } from 'features/areaAssignments/types';

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

interface AreaAssignmentPageProps {
  orgId: string;
  areaAssId: string;
}

const AreaAssignmentPage: PageWithLayout<AreaAssignmentPageProps> = ({
  orgId,
  areaAssId,
}) => {
  const assignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);
  const statsFuture = useAreaAssignmentStats(parseInt(orgId), areaAssId);
  const areasStats = useAssignmentAreaStats(parseInt(orgId), areaAssId);
  const dataGraph = useAssignmentAreaGraph(parseInt(orgId), areaAssId);
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
        }/areaassignments/${assignment.id}/plan`;
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
                  <Box display="flex" width="100%">
                    <NumberCard
                      firstNumber={stats.num_successful_visited_households}
                      message={'Successful visits'}
                      secondNumber={stats.num_visited_households}
                    />
                    <Divider flexItem orientation="vertical" />
                    <NumberCard
                      firstNumber={stats.num_visited_households}
                      message={'Households visited'}
                      secondNumber={stats.num_households}
                    />
                    <Divider flexItem orientation="vertical" />
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
                      const filteredAreas = dataGraph
                        .map((area) => {
                          return areasStats.stats.filter(
                            (item) => item.areaId === area.area.id
                          );
                        })
                        .flat();

                      const sortedAreas = filteredAreas
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

                      const maxHouseholdVisits = Math.max(
                        ...dataGraph.flatMap((areaCard) =>
                          areaCard.data.map(
                            (graphData) => graphData.householdVisits
                          )
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
                          maxVisitedHouseholds={maxHouseholdVisits}
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

AreaAssignmentPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default AreaAssignmentPage;
