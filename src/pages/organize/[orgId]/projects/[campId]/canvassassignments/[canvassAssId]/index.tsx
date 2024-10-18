import { Box, Button, Card, Divider, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { Edit } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

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
            <Box display="flex" justifyContent="space-between" width="100%">
              <NumberCard
                firstNumber={stats.num_visited_households}
                message={'Households visited'}
                secondNumber={stats.num_households}
              />
              <NumberCard
                firstNumber={stats.num_successful_visited_households}
                message={'Succesful visits'}
                secondNumber={stats.num_visited_households}
              />
              <NumberCard
                firstNumber={stats.num_visited_places}
                message={'Places visited'}
                secondNumber={stats.num_places}
              />
              <NumberCard
                firstNumber={stats.num_visited_areas}
                message={'Areas visited'}
                secondNumber={stats.num_areas}
              />
            </Box>
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
