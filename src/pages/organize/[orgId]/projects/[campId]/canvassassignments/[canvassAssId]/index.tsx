import { Box, Button, Card, Divider, lighten, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { makeStyles, useTheme } from '@mui/styles';

import { PageWithLayout } from 'utils/types';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';
import { getContrastColor } from 'utils/colorUtils';
import { AREAS } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import ZUIFutures from 'zui/ZUIFutures';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import useCanvassAssignmentStats from 'features/canvassAssignments/hooks/useCanvassAssignmentStats';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import CanvassAssignmentLayout from 'features/canvassAssignments/layouts/CanvassAssignmentLayout';
import AssignmentMetricsChart from 'features/canvassAssignments/components/AssignmentMetricsChart';

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
  const theme = useTheme();
  const assignmentFuture = useCanvassAssignment(parseInt(orgId), canvassAssId);
  const statsFuture = useCanvassAssignmentStats(parseInt(orgId), canvassAssId);
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
              {stats.num_areas > 0 ? (
                <Box p={2}>
                  <Button
                    onClick={() => router.push(planUrl)}
                    startIcon={<Edit />}
                    variant="text"
                  >
                    Edit plan
                  </Button>
                </Box>
              ) : (
                <Box p={2}>
                  <Typography>
                    This assignment has not been planned yet.
                  </Typography>
                  <Box pt={1}>
                    <Button
                      onClick={() => router.push(planUrl)}
                      startIcon={<Edit />}
                      variant="text"
                    >
                      Plan now
                    </Button>
                  </Box>
                </Box>
              )}
            </Card>
            <Card>
              {stats.metrics && <AssignmentMetricsChart stats={stats} />}
            </Card>
            <Card>
              <Box padding={2}>
                <Typography variant="h4">Progress</Typography>
              </Box>
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="column" gap={1} padding={2}>
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography variant="h5">Areas</Typography>
                    <ZUIAnimatedNumber value={stats.num_areas}>
                      {(animatedValue) => (
                        <Box className={classes.statsChip}>{animatedValue}</Box>
                      )}
                    </ZUIAnimatedNumber>
                  </Box>
                  <ZUIStackedStatusBar
                    values={[
                      {
                        color: theme.palette.primary.main,
                        value: stats.num_visited_areas,
                      },
                      {
                        color: lighten(theme.palette.primary.main, 0.6),
                        value: stats.num_areas - stats.num_visited_areas,
                      },
                    ]}
                  />
                  <Box display="flex" justifyContent="center" width="100%">
                    <Typography>{`${stats.num_visited_areas} logged`}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="column" gap={1} padding={2}>
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography variant="h5">Places</Typography>
                    <ZUIAnimatedNumber value={stats.num_places}>
                      {(animatedValue) => (
                        <Box className={classes.statsChip}>{animatedValue}</Box>
                      )}
                    </ZUIAnimatedNumber>
                  </Box>
                  <ZUIStackedStatusBar
                    values={[
                      {
                        color: theme.palette.primary.main,
                        value: stats.num_visited_places,
                      },
                      {
                        color: lighten(theme.palette.primary.main, 0.6),
                        value: stats.num_places - stats.num_visited_places,
                      },
                    ]}
                  />
                  <Box display="flex" justifyContent="center" width="100%">
                    <Typography>{`${stats.num_visited_places} logged`}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box display="flex" flexDirection="column" gap={1} padding={2}>
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography variant="h5">Households</Typography>
                    <ZUIAnimatedNumber value={stats.num_households}>
                      {(animatedValue) => (
                        <Box className={classes.statsChip}>{animatedValue}</Box>
                      )}
                    </ZUIAnimatedNumber>
                  </Box>
                  <ZUIStackedStatusBar
                    values={[
                      {
                        color: theme.palette.primary.main,
                        value: stats.num_successful_visited_households,
                      },
                      {
                        color: lighten(theme.palette.primary.main, 0.5),
                        value:
                          stats.num_visited_households -
                          stats.num_successful_visited_households,
                      },
                      {
                        color: lighten(theme.palette.primary.main, 0.8),
                        value:
                          stats.num_households - stats.num_visited_households,
                      },
                    ]}
                  />
                  <Box display="flex" justifyContent="center" width="100%">
                    <Typography>{`${stats.num_successful_visited_households} success of ${stats.num_visited_households} visits`}</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
            <Card>
              <Box display="flex" flexDirection="column" padding={2}>
                <Typography variant="h5">Rogue visits</Typography>
                <Typography>
                  {`Number of visited places outside the assigned areas: ${stats.num_visited_places_outside_areas}`}
                </Typography>
                <Typography>
                  {`Number of visited households outside the assigned areas: ${stats.num_visited_households_outside_areas}`}
                </Typography>
              </Box>
            </Card>
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
