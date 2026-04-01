import { Box, Button, Card, Divider, Grid, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { AREAS } from 'utils/featureFlags';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import { PageWithLayout } from 'utils/types';
import NumberCard from 'features/areaAssignments/components/NumberCard';
import { scaffold } from 'utils/next';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import useAreaAssignmentStats from 'features/areaAssignments/hooks/useAreaAssignmentStats';
import ZUIFutures from 'zui/ZUIFutures';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areaAssignments/l10n/messageIds';
import useAreaAssignees from 'features/areaAssignments/hooks/useAreaAssignees';
import { AREA_STATS, hasFeature } from 'utils/featureFlags';
import AreaStatsCard from 'features/areaAssignments/components/AreaStatsCard';

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
  areaAssId: number;
}

const AreaAssignmentPage: PageWithLayout<AreaAssignmentPageProps> = ({
  orgId,
  areaAssId,
}) => {
  const messages = useMessages(messageIds);
  const sessionsFuture = useAreaAssignees(parseInt(orgId), areaAssId);
  const assignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);
  const statsFuture = useAreaAssignmentStats(parseInt(orgId), areaAssId);
  const router = useRouter();

  const numAreas = new Set(
    sessionsFuture.data?.map((session) => session.area_id) ?? []
  ).size;

  const hasAreaFeature = hasFeature(AREA_STATS, parseInt(orgId), process.env);

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
          const planUrl = `/organize/${orgId}/projects/${assignment.project_id}/areaassignments/${assignment.id}/map`;
          return (
            <Box display="flex" flexDirection="column" gap={2}>
              {numAreas == 0 && (
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
              {numAreas > 0 && (
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
                  {hasAreaFeature && (
                    <Grid container spacing={2}>
                      <AreaStatsCard
                        orgId={parseInt(orgId)}
                        areaAssId={areaAssId}
                        assignment={assignment}
                      />
                    </Grid>
                  )}
                </>
              )}
            </Box>
          );
        }}
      </ZUIFutures>
    </>
  );
};

AreaAssignmentPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default AreaAssignmentPage;
