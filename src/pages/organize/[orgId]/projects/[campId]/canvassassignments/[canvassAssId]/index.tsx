import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Edit } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import AreaCard from 'features/canvassAssignments/components/AreaCard';
import { AREAS } from 'utils/featureFlags';
import CanvassAssignmentLayout from 'features/canvassAssignments/layouts/CanvassAssignmentLayout';
import { getContrastColor } from 'utils/colorUtils';
import { PageWithLayout } from 'utils/types';
import NumberCard from 'features/canvassAssignments/components/NumberCard';
import { scaffold } from 'utils/next';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import useCanvassAssignmentStats from 'features/canvassAssignments/hooks/useCanvassAssignmentStats';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import ZUIFutures from 'zui/ZUIFutures';
import useAssignmentAreaStats from 'features/canvassAssignments/hooks/useAssignmentAreaStats';
import useAssignmentAreaGraph from 'features/canvassAssignments/hooks/useAssignmentAreaGraph';

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

const useStyles = makeStyles((theme) => ({
  chip: {
    backgroundColor: theme.palette.statusColors.gray,
    borderRadius: '1em',
    color: theme.palette.text.secondary,
    display: 'flex',
    fontSize: '1.8em',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
  },
  statsChip: {
    backgroundColor: theme.palette.statusColors.blue,
    borderRadius: '1em',
    color: getContrastColor(theme.palette.statusColors.blue),
    display: 'flex',
    fontSize: '1rem',
    lineHeight: 'normal',
    marginRight: '0.1em',
    overflow: 'hidden',
    padding: '0.2em 0.7em',
  },
}));

const CanvassAssignmentPage: PageWithLayout<CanvassAssignmentPageProps> = ({
  orgId,
  canvassAssId,
}) => {
  const assignmentFuture = useCanvassAssignment(parseInt(orgId), canvassAssId);
  const statsFuture = useCanvassAssignmentStats(parseInt(orgId), canvassAssId);
  const areasStats = useAssignmentAreaStats(parseInt(orgId), canvassAssId);
  const dataGraph = useAssignmentAreaGraph(parseInt(orgId), canvassAssId);
  const classes = useStyles();
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
                  <Box display="flex" justifyContent="space-between" p={2}>
                    <Typography variant="h4">Areas</Typography>
                    {!!stats.num_areas && (
                      <ZUIAnimatedNumber value={stats.num_areas}>
                        {(animatedValue) => (
                          <Box className={classes.chip}>{animatedValue}</Box>
                        )}
                      </ZUIAnimatedNumber>
                    )}
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
                  {assignment.start_date && (
                    <ZUIFutures futures={{ areasStats, dataGraph }}>
                      {({ data: { areasStats, dataGraph } }) => {
                        // Sort areas based on successful visits only
                        const sortedAreas = areasStats.stats
                          .map((area) => {
                            const successfulVisitsTotal =
                              dataGraph
                                .find((graph) => graph.areaId === area.areaId)
                                ?.successfulVisits.reduce(
                                  (sum, item) => sum + item.accumulatedVisits,
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
                        return (
                          <AreaCard
                            areas={sortedAreas}
                            assignment={assignment}
                            data={dataGraph}
                          />
                        );
                      }}
                    </ZUIFutures>
                  )}
                </Grid>
                {!assignment.start_date && (
                  <Card>
                    <Box p={10} sx={{ textAlign: ' center' }}>
                      <Typography variant="h5">
                        Start the assignment to view area-specific statistics.
                      </Typography>
                    </Box>
                  </Card>
                )}
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
