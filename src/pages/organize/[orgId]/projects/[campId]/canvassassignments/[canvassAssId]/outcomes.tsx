import { Close } from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

import ZUIFuture from 'zui/ZUIFuture';
import MetricCard from 'features/canvassAssignments/components/MetricCard';
import { AREAS } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useCanvassAssignmentMutations from 'features/canvassAssignments/hooks/useCanvassAssignmentMutations';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import { ZetkinMetric } from 'features/canvassAssignments/types';
import CanvassAssignmentLayout from 'features/canvassAssignments/layouts/CanvassAssignmentLayout';
import ZUICard from 'zui/ZUICard';
import theme from 'theme';

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

interface CanvassAssignmentOutcomesProps {
  orgId: string;
  canvassAssId: string;
}

const CanvassAssignmentOutcomesPage: PageWithLayout<
  CanvassAssignmentOutcomesProps
> = ({ orgId, canvassAssId }) => {
  const { updateCanvassAssignment } = useCanvassAssignmentMutations(
    parseInt(orgId),
    canvassAssId
  );
  const canvassAssignmentFuture = useCanvassAssignment(
    parseInt(orgId),
    canvassAssId
  );

  const [metricBeingCreated, setMetricBeingCreated] =
    useState<ZetkinMetric | null>(null);
  const [metricBeingEdited, setMetricBeingEdited] =
    useState<ZetkinMetric | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [metricBeingDeleted, setMetricBeingDeleted] =
    useState<ZetkinMetric | null>(null);

  const handleSaveMetric = async (metric: ZetkinMetric) => {
    if (canvassAssignmentFuture.data) {
      await updateCanvassAssignment({
        metrics: canvassAssignmentFuture.data.metrics
          .map((m) => (m.id === metric.id ? metric : m))
          .concat(metric.id ? [] : [metric]),
      });
    }
    setMetricBeingEdited(null);
    setMetricBeingCreated(null);
  };

  const handleDeleteMetric = async (id: string) => {
    if (canvassAssignmentFuture.data) {
      await updateCanvassAssignment({
        metrics: canvassAssignmentFuture.data.metrics.filter(
          (m) => m.id !== id
        ),
      });
    }
    setMetricBeingEdited(null);
  };

  const handleAddNewMetric = (kind: 'boolean' | 'scale5') => {
    setMetricBeingCreated({
      definesDone: false,
      description: '',
      id: '',
      kind: kind,
      question: '',
    });
  };

  return (
    <ZUIFuture future={canvassAssignmentFuture}>
      {(assignment) => (
        <Box display="flex">
          <Box width="50%">
            {metricBeingCreated && (
              <Box mb={2}>
                <MetricCard
                  hasDefinedDone={assignment.metrics.some(
                    (metric) => metric.definesDone
                  )}
                  isOnlyQuestion={assignment.metrics.length == 1}
                  metric={metricBeingCreated}
                  onClose={() => setMetricBeingCreated(null)}
                  onDelete={(target: EventTarget & HTMLButtonElement) => {
                    setMetricBeingDeleted(metricBeingCreated);
                    setAnchorEl(target);
                    setMetricBeingCreated(null);
                  }}
                  onSave={handleSaveMetric}
                />
              </Box>
            )}
            {metricBeingEdited && (
              <Modal
                open={metricBeingEdited ? true : false}
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <MetricCard
                  hasDefinedDone={assignment.metrics.some(
                    (metric) => metric.definesDone
                  )}
                  isOnlyQuestion={assignment.metrics.length == 1}
                  metric={metricBeingEdited}
                  onClose={() => setMetricBeingEdited(null)}
                  onDelete={(target: EventTarget & HTMLButtonElement) => {
                    setMetricBeingDeleted(metricBeingEdited);
                    setAnchorEl(target);
                    setMetricBeingEdited(null);
                  }}
                  onSave={handleSaveMetric}
                />
              </Modal>
            )}
            <Box>
              <Card
                sx={{
                  backgroundColor: theme.palette.grey[200],
                  border: 'none',
                  padding: 2,
                }}
              >
                <Typography color="secondary">
                  Here you can configure the questions for your canvass
                  assignment
                </Typography>
                <Box alignItems="center" display="flex" mt={2}>
                  <Button
                    onClick={() => handleAddNewMetric('boolean')}
                    sx={{ marginRight: 1 }}
                    variant="outlined"
                  >
                    Add yes/no question
                  </Button>
                  <Button
                    onClick={() => handleAddNewMetric('scale5')}
                    variant="outlined"
                  >
                    Add scale question
                  </Button>
                </Box>
              </Card>
              <Box mt={3}>
                {assignment.metrics.length > 0 ? 'Your list of questions:' : ''}
                {assignment.metrics.map((metric) => (
                  <Card key={metric.id} sx={{ marginTop: 2 }}>
                    <CardContent>
                      <Box display="flex">
                        <Box
                          display="flex"
                          flexDirection="column"
                          flexGrow={1}
                          gap={1}
                        >
                          {metric.definesDone && (
                            <Typography color="error">
                              This question defines if the mission was
                              successful
                            </Typography>
                          )}
                          <Typography gutterBottom variant="h5">
                            {metric.question || 'Untitled question'}
                          </Typography>
                          <Typography>
                            {metric.description || 'No description'}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                          <Typography color="secondary">
                            {metric.kind == 'boolean' ? 'Yes/no' : 'Scale'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'end' }}>
                      <Button onClick={() => setMetricBeingEdited(metric)}>
                        Edit
                      </Button>

                      {assignment.metrics.length > 1 && (
                        <Button
                          onClick={(ev) => {
                            setMetricBeingDeleted(metric);
                            setAnchorEl(ev.currentTarget);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                ))}
              </Box>
              <Dialog onClose={() => setAnchorEl(null)} open={!!anchorEl}>
                <Box display="flex" flexDirection="column" gap={1} padding={2}>
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">{`Delete "${
                      assignment.metrics.find(
                        (metric) => metric.id == metricBeingDeleted?.id
                      )?.question
                    }"`}</Typography>
                    <IconButton
                      onClick={() => {
                        setMetricBeingDeleted(null);
                        setAnchorEl(null);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>

                  {metricBeingDeleted?.definesDone ? (
                    <Typography>
                      {`If you want to delete "${metricBeingDeleted.question}
                    }" you need to pick another
                  yes/no-question to be the question that defines if the mision
                  was successful`}{' '}
                    </Typography>
                  ) : (
                    <Typography>
                      Are you sure you want to delete this question? This action
                      is permanent and it cannot be undone.
                    </Typography>
                  )}

                  {metricBeingDeleted?.definesDone ? (
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography>Yes/no questions</Typography>
                      {assignment.metrics
                        .filter(
                          (metric) =>
                            metric.kind == 'boolean' &&
                            metric.id != metricBeingDeleted?.id
                        )
                        .map((metric) => (
                          <Box
                            key={metric.question}
                            alignItems="center"
                            display="flex"
                            gap={1}
                            justifyContent="space-between"
                            width="100%"
                          >
                            {metric.question}
                            <Button
                              onClick={() => {
                                if (metricBeingDeleted) {
                                  const filtered = assignment.metrics.filter(
                                    (metric) =>
                                      metric.id != metricBeingDeleted.id
                                  );
                                  updateCanvassAssignment({
                                    metrics: [
                                      ...filtered.slice(
                                        0,
                                        filtered.indexOf(metric)
                                      ),
                                      {
                                        ...metric,
                                        definesDone: true,
                                      },
                                      ...filtered.slice(
                                        filtered.indexOf(metric) + 1
                                      ),
                                    ],
                                  });
                                }
                                setAnchorEl(null);
                                setMetricBeingDeleted(null);
                              }}
                              variant="outlined"
                            >
                              select
                            </Button>
                          </Box>
                        ))}
                    </Box>
                  ) : (
                    <Box display="flex" justifyContent="end" p={2}>
                      <Button
                        onClick={() => {
                          setMetricBeingDeleted(null), setAnchorEl(null);
                        }}
                        sx={{ marginRight: 2 }}
                      >
                        CANCEL
                      </Button>
                      <Button
                        onClick={() => {
                          if (metricBeingDeleted !== null) {
                            handleDeleteMetric(metricBeingDeleted.id);
                            setAnchorEl(null);
                            setMetricBeingDeleted(null);
                          }
                        }}
                        variant="contained"
                      >
                        CONFIRM
                      </Button>
                    </Box>
                  )}
                </Box>
              </Dialog>
            </Box>
          </Box>
          <Box ml={2} width="50%">
            <ZUICard header="Data collection" sx={{ mb: 2 }}>
              <Typography mb={2}>
                Decide what level of precision should be used for statistics.
              </Typography>
              <Divider />
              <FormControl>
                <RadioGroup
                  onChange={(ev) => {
                    const value = ev.target.value;
                    if (value === 'household' || value === 'place') {
                      updateCanvassAssignment({
                        reporting_level: value,
                      });
                    }
                  }}
                  value={assignment.reporting_level}
                >
                  <Box mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card
                          onClick={() =>
                            updateCanvassAssignment({
                              reporting_level: 'household',
                            })
                          }
                          sx={{
                            border:
                              assignment.reporting_level === 'household'
                                ? `1px solid ${theme.palette.primary.main}`
                                : `1px solid ${theme.palette.grey[300]}`,
                            cursor: 'pointer',
                            height: '100%',
                          }}
                        >
                          <Box p={1}>
                            <FormControlLabel
                              control={<Radio />}
                              label={
                                <Typography variant="h6">Household</Typography>
                              }
                              sx={{ pointerEvents: 'none' }}
                              value="household"
                            />
                          </Box>
                          <Divider />
                          <Typography p={2}>
                            Collect the most precise data.
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card
                          onClick={() =>
                            updateCanvassAssignment({
                              reporting_level: 'place',
                            })
                          }
                          sx={{
                            border:
                              assignment.reporting_level === 'place'
                                ? `1px solid ${theme.palette.primary.main}`
                                : `1px solid ${theme.palette.grey[300]}`,
                            cursor: 'pointer',
                            height: '100%',
                          }}
                        >
                          <Box p={1}>
                            <FormControlLabel
                              control={<Radio />}
                              label={
                                <Typography variant="h6">Place</Typography>
                              }
                              sx={{ pointerEvents: 'none' }}
                              value="place"
                            />
                          </Box>
                          <Divider />
                          <Typography p={2}>
                            Collect data only on places, preserving some
                            privacy.
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </RadioGroup>
              </FormControl>
            </ZUICard>
          </Box>
        </Box>
      )}
    </ZUIFuture>
  );
};

CanvassAssignmentOutcomesPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentOutcomesPage;
