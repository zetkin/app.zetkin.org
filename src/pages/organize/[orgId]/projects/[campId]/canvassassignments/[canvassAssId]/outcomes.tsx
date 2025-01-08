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
  IconButton,
  MenuItem,
  Modal,
  Select,
  Typography,
} from '@mui/material';

import ZUIFuture from 'zui/ZUIFuture';
import MetricCard from 'features/canvassAssignments/components/MetricCard';
import { AREAS } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useCanvassAssignmentMutations from 'features/canvassAssignments/hooks/useCanvassAssignmentMutations';
import useCanvassAssignment from 'features/canvassAssignments/hooks/useCanvassAssignment';
import {
  ZetkinCanvassAssignment,
  ZetkinMetric,
} from 'features/canvassAssignments/types';
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
  const [idOfMetricBeingDeleted, setIdOfQuestionBeingDeleted] = useState<
    string | null
  >(null);

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
    <Box width="50%">
      <ZUIFuture future={canvassAssignmentFuture}>
        {(assignment) => (
          <>
            <ZUICard header="Reporting level" sx={{ mb: 2 }}>
              <Typography mb={2}>
                Decide what level of precision should be used for statistics.
              </Typography>
              <Select
                label="Reporting level"
                onChange={(ev) => {
                  const rawValue = ev.target.value;
                  updateCanvassAssignment({
                    reporting_level:
                      rawValue as ZetkinCanvassAssignment['reporting_level'],
                  });
                }}
                value={assignment.reporting_level}
              >
                <MenuItem value="household">Household (more precise)</MenuItem>
                <MenuItem value="place">Place (more privacy)</MenuItem>
              </Select>
            </ZUICard>
            {metricBeingCreated && (
              <MetricCard
                hasDefinedDone={assignment.metrics.some(
                  (metric) => metric.definesDone
                )}
                isOnlyQuestion={assignment.metrics.length == 1}
                metric={metricBeingCreated}
                onClose={() => setMetricBeingCreated(null)}
                onDelete={(target: EventTarget & HTMLButtonElement) => {
                  if (metricBeingCreated.definesDone) {
                    setIdOfQuestionBeingDeleted(metricBeingCreated.id);
                    setAnchorEl(target);
                    setMetricBeingCreated(null);
                  } else {
                    handleDeleteMetric(metricBeingCreated.id);
                  }
                }}
                onSave={handleSaveMetric}
              />
            )}
            {metricBeingEdited && (
              <Modal
                open={metricBeingEdited ? true : false}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  display: 'flex',
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
                    if (metricBeingEdited.definesDone) {
                      setIdOfQuestionBeingDeleted(metricBeingEdited.id);
                      setAnchorEl(target);
                      setMetricBeingEdited(null);
                    } else {
                      handleDeleteMetric(metricBeingEdited.id);
                    }
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
                  marginTop: 2,
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
                            if (metric.definesDone) {
                              setIdOfQuestionBeingDeleted(metric.id);
                              setAnchorEl(ev.currentTarget);
                            } else {
                              handleDeleteMetric(metric.id);
                            }
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
                        (metric) => metric.id == idOfMetricBeingDeleted
                      )?.question
                    }"`}</Typography>
                    <IconButton
                      onClick={() => {
                        setIdOfQuestionBeingDeleted(null);
                        setAnchorEl(null);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Box>
                  <Typography>
                    {`If you want to delete "${
                      assignment.metrics.find(
                        (metric) => metric.id == idOfMetricBeingDeleted
                      )?.question
                    }" you need to pick another
                  yes/no-question to be the question that defines if the mision
                  was successful`}
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>Yes/no questions</Typography>
                    {assignment.metrics
                      .filter(
                        (metric) =>
                          metric.kind == 'boolean' &&
                          metric.id != idOfMetricBeingDeleted
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
                              if (idOfMetricBeingDeleted) {
                                const filtered = assignment.metrics.filter(
                                  (metric) =>
                                    metric.id != idOfMetricBeingDeleted
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
                              setIdOfQuestionBeingDeleted(null);
                            }}
                            variant="outlined"
                          >
                            select
                          </Button>
                        </Box>
                      ))}
                  </Box>
                </Box>
              </Dialog>
            </Box>
          </>
        )}
      </ZUIFuture>
    </Box>
  );
};

CanvassAssignmentOutcomesPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentOutcomesPage;
