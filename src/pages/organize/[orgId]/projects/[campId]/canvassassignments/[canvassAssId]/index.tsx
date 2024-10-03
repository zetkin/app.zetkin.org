import { Box, Button, Card, Divider, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { makeStyles } from '@mui/styles';

import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useCanvassAssignment from 'features/areas/hooks/useCanvassAssignment';
import { Msg } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import useCanvassSessions from 'features/areas/hooks/useCanvassSessions';
import ZUIFutures from 'zui/ZUIFutures';
import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import useCanvassAssignmentStats from 'features/areas/hooks/useCanvassAssignmentStats';

const scaffoldOptions = {
  authLevelRequired: 2,
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
}));

const CanvassAssignmentPage: PageWithLayout<CanvassAssignmentPageProps> = ({
  orgId,
  canvassAssId,
}) => {
  const assignmentFuture = useCanvassAssignment(parseInt(orgId), canvassAssId);
  const sessionsFuture = useCanvassSessions(parseInt(orgId), canvassAssId);
  const statsFuture = useCanvassAssignmentStats(parseInt(orgId), canvassAssId);
  const classes = useStyles();
  const router = useRouter();

  return (
    <ZUIFutures
      futures={{
        assignment: assignmentFuture,
        sessions: sessionsFuture,
        stats: statsFuture,
      }}
    >
      {({ data: { assignment, sessions, stats } }) => {
        const areas = new Set(sessions.map((session) => session.area.id));
        const areaCount = areas.size;

        const planUrl = `/organize/${orgId}/projects/${
          assignment.campaign.id || 'standalone'
        }/canvassassignments/${assignment.id}/plan`;

        return (
          <Card>
            <Box display="flex" justifyContent="space-between" p={2}>
              <Typography variant="h4">
                <Msg id={messageIds.canvassAssignment.overview.areas.title} />
              </Typography>
              {!!areaCount && (
                <ZUIAnimatedNumber value={areaCount}>
                  {(animatedValue) => (
                    <Box className={classes.chip}>{animatedValue}</Box>
                  )}
                </ZUIAnimatedNumber>
              )}
            </Box>
            <Divider />
            {areaCount > 0 ? (
              <Box p={2}>
                <Button
                  onClick={() => router.push(planUrl)}
                  startIcon={<Edit />}
                  variant="text"
                >
                  <Msg
                    id={messageIds.canvassAssignment.overview.areas.editButton}
                  />
                </Button>
              </Box>
            ) : (
              <Box p={2}>
                <Typography>
                  <Msg
                    id={messageIds.canvassAssignment.overview.areas.subtitle}
                  />
                </Typography>
                <Box pt={1}>
                  <Button
                    onClick={() => router.push(planUrl)}
                    startIcon={<Edit />}
                    variant="text"
                  >
                    <Msg
                      id={
                        messageIds.canvassAssignment.overview.areas.defineButton
                      }
                    />
                  </Button>
                </Box>
              </Box>
            )}
            <Box display="flex" flexDirection="column">
              <Box>{`Number of areas: ${areaCount}`}</Box>
              <Box>{`Number of areas with visits in this assignment: ${stats.numVisitedAreas}`}</Box>
              <Box>{`Number of places: ${stats.numPlaces}`}</Box>
              <Box>{`Number of places with visits in this assignment: ${stats.numVisitedPlaces}`}</Box>
              <Box>{`Number of households: ${stats.numHouseholds}`}</Box>
              <Box>{`Number of households with visits in this assignment: ${stats.numVisitedHouseholds}`}</Box>
            </Box>
          </Card>
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
