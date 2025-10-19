import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { HOUSEHOLDS2 } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/householdsAssignments/l10n/messageIds';
import useHouseholdAssignees from 'features/householdsAssignments/hooks/useHouseholdAssignees';
import useHouseholdAssignment from 'features/householdsAssignments/hooks/useHouseholdAssignment';
import useHouseholdAssignmentStats from 'features/householdsAssignments/hooks/useHouseholdAssignmentStats';
import useAssignmentHouseholdStats from 'features/householdsAssignments/hooks/useAssignmentHouseholdStats';
import useAssignmentHouseholdGraph from 'features/householdsAssignments/hooks/useAssignmentHouseholdGraph';
import HouseholdAssignmentLayout from 'features/householdsAssignments/layouts/HouseholdAssignmentLayout';
import ZUIFutures from 'zui/ZUIFutures';
import NumberCard from 'features/householdsAssignments/components/NumberCard';
import { ZetkinAssignmentHouseholdStatsItem } from 'features/householdsAssignments/types';
import HouseholdCard from 'features/householdsAssignments/components/HouseholdCard';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [HOUSEHOLDS2],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, householdsAssId } = ctx.params!;
  return {
    props: { campId, householdsAssId, orgId },
  };
}, scaffoldOptions);

interface HouseholdsAssignmentPageProps {
  campId: string;
  householdsAssId: string;
  orgId: string;
}

const HouseholdsAssignmentPage: PageWithLayout<
  HouseholdsAssignmentPageProps
> = ({ campId, orgId, householdsAssId }) => {
  const messages = useMessages(messageIds);
  const sessionsFuture = useHouseholdAssignees(
    parseInt(campId),
    parseInt(orgId),
    parseInt(householdsAssId)
  );
  const assignmentFuture = useHouseholdAssignment(
    parseInt(campId),
    parseInt(orgId),
    parseInt(householdsAssId)
  );
  const statsFuture = useHouseholdAssignmentStats(
    parseInt(campId),
    parseInt(orgId),
    parseInt(householdsAssId)
  );
  const householdsStats = useAssignmentHouseholdStats(
    parseInt(campId),
    parseInt(orgId),
    parseInt(householdsAssId)
  );
  const dataGraph = useAssignmentHouseholdGraph(
    parseInt(campId),
    parseInt(orgId),
    parseInt(householdsAssId)
  );
  const router = useRouter();

  const numHouseholds = new Set(
    sessionsFuture.data?.map((session) => session.household_id) ?? []
  ).size;

  return (
    <>
      <Head>
        <title>{assignmentFuture.data?.title}</title>
      </Head>
      <ZUIFutures
        futures={{
          assignment: assignmentFuture,
          stats: statsFuture,
        }}
      >
        {({ data: { assignment, stats } }) => {
          const planUrl = `/organize/${orgId}/projects/${assignment.campId}/householdsassignments/${assignment.id}/map`;
          return (
            <Box display="flex" flexDirection="column" gap={2}>
              {numHouseholds == 0 && (
                <Card>
                  <Box p={10} sx={{ textAlign: ' center' }}>
                    <Typography>
                      <Msg id={messageIds.overview.empty.description} />
                    </Typography>
                    <Box pt={4}>
                      <Button
                        onClick={() => router.push(planUrl)}
                        startIcon={<Edit />}
                        variant="contained"
                      >
                        <Msg
                          id={messageIds.overview.empty.startPlanningButton}
                        />
                      </Button>
                    </Box>
                  </Box>
                </Card>
              )}
              {numHouseholds > 0 && (
                <>
                  <Card>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      marginLeft={1}
                      maxHeight={40}
                      p={1}
                    >
                      <Typography variant="h5">
                        <Msg id={messageIds.overview.progress.statsTitle} />
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" width="100%">
                      <NumberCard
                        firstNumber={stats.num_successful_visits}
                        message={messages.overview.progress.headers.successful()}
                        secondNumber={stats.num_visits}
                      />
                      {stats.num_households_visited != null && (
                        <>
                          <Divider flexItem orientation="vertical" />
                          <NumberCard
                            firstNumber={stats.num_households_visited}
                            message={messages.overview.progress.headers.households()}
                            secondNumber={stats.num_households}
                          />
                        </>
                      )}
                      <Divider flexItem orientation="vertical" />
                      <NumberCard
                        firstNumber={stats.num_locations_visited}
                        message={messages.overview.progress.headers.locations()}
                        secondNumber={stats.num_locations}
                      />
                    </Box>
                  </Card>
                  <Grid container spacing={2}>
                    <ZUIFutures futures={{ dataGraph, householdsStats }}>
                      {({ data: { householdsStats, dataGraph } }) => {
                        const filteredHouseholds = dataGraph
                          .map((household) => {
                            return householdsStats.stats.filter(
                              (item) =>
                                item.household_id === household.household_id
                            );
                          })
                          .flat();

                        const sortedHouseholds = filteredHouseholds
                          .map((household) => {
                            const successfulVisitsTotal =
                              dataGraph
                                .find(
                                  (graph) =>
                                    graph.household_id ===
                                    household.household_id
                                )
                                ?.data.reduce(
                                  (sum, item) => sum + item.successfulVisits,
                                  0
                                ) || 0;

                            return {
                              household,
                              successfulVisitsTotal,
                            };
                          })
                          .sort(
                            (a, b) =>
                              b.successfulVisitsTotal - a.successfulVisitsTotal
                          )
                          .map(({ household }) => household);

                        const maxHouseholdVisits = Math.max(
                          ...dataGraph.flatMap((householdCard) =>
                            householdCard.data.map(
                              (graphData) => graphData.householdVisits
                            )
                          )
                        );

                        const noHouseholdsData = dataGraph.find(
                          (graph) => !graph.household_id
                        );
                        if (
                          noHouseholdsData &&
                          noHouseholdsData.data.length > 0
                        ) {
                          const latestEntry = [...noHouseholdsData.data].sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )[0];

                          const num_successful_visited_households =
                            latestEntry.successfulVisits;

                          const num_visited_households =
                            latestEntry.householdVisits;

                          const noArea: ZetkinAssignmentHouseholdStatsItem = {
                            household_id: null,
                            num_households: 0,
                            num_locations: 0,
                            num_successful_visited_households,
                            num_visited_households,
                            num_visited_locations: 0,
                          };
                          sortedHouseholds.push(noArea);
                        }
                        return (
                          <HouseholdCard
                            assignment={assignment}
                            data={dataGraph}
                            households={sortedHouseholds}
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
    </>
  );
};

HouseholdsAssignmentPage.getLayout = function getLayout(page) {
  return (
    <HouseholdAssignmentLayout {...page.props}>
      {page}
    </HouseholdAssignmentLayout>
  );
};

export default HouseholdsAssignmentPage;
