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
  Select,
  Typography,
} from '@mui/material';
import Head from 'next/head';

import ZUIFuture from 'zui/ZUIFuture';
import MetricCard from 'features/areaAssignments/components/MetricCard';
import { AREAS } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useAreaAssignmentMutations from 'features/areaAssignments/hooks/useAreaAssignmentMutations';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import {
  ZetkinAreaAssignment,
  ZetkinMetric,
} from 'features/areaAssignments/types';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import ZUICard from 'zui/ZUICard';

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

interface AreaAssignmentReportProps {
  orgId: string;
  areaAssId: string;
}

const AreaAssignmentReportPage: PageWithLayout<AreaAssignmentReportProps> = ({
  orgId,
  areaAssId,
}) => {
  const { updateAreaAssignment } = useAreaAssignmentMutations(
    parseInt(orgId),
    areaAssId
  );
  const areaAssignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);

  const [metricBeingEdited, setMetricBeingEdited] =
    useState<ZetkinMetric | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [idOfMetricBeingDeleted, setIdOfQuestionBeingDeleted] = useState<
    string | null
  >(null);

  const handleSaveMetric = async (metric: ZetkinMetric) => {
    if (areaAssignmentFuture.data) {
      await updateAreaAssignment({
        metrics: areaAssignmentFuture.data.metrics
          .map((m) => (m.id === metric.id ? metric : m))
          .concat(metric.id ? [] : [metric]),
      });
    }
    setMetricBeingEdited(null);
  };

  const handleDeleteMetric = async (id: string) => {
    if (areaAssignmentFuture.data) {
      await updateAreaAssignment({
        metrics: areaAssignmentFuture.data.metrics.filter((m) => m.id !== id),
      });
    }
    setMetricBeingEdited(null);
  };

  const handleAddNewMetric = (kind: 'boolean' | 'scale5') => {
    setMetricBeingEdited({
      definesDone: false,
      description: '',
      id: '',
      kind: kind,
      question: '',
    });
  };

  return (
    <>
      <Head>
        <title>{areaAssignmentFuture.data?.title}</title>
      </Head>
      <Box width="50%">
        <ZUIFuture future={areaAssignmentFuture}>
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
                    updateAreaAssignment({
                      reporting_level:
                        rawValue as ZetkinAreaAssignment['reporting_level'],
                    });
                  }}
                  value={assignment.reporting_level}
                >
                  <MenuItem value="household">
                    Household (more precise)
                  </MenuItem>
                  <MenuItem value="location">Place (more privacy)</MenuItem>
                </Select>
              </ZUICard>
              <Typography>
                Here you can configure the questions for your area assignment
              </Typography>
              <Box alignItems="center" display="flex" mt={2}>
                <Button
                  onClick={() => handleAddNewMetric('boolean')}
                  sx={{ marginRight: 1 }}
                  variant="contained"
                >
                  Add yes/no question
                </Button>
                <Button
                  onClick={() => handleAddNewMetric('scale5')}
                  variant="contained"
                >
                  Add scale question
                </Button>
              </Box>
              {metricBeingEdited && (
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
              )}
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
                    <CardActions>
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
                  yes/no-question to be the question that defines if the msision
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
                                updateAreaAssignment({
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
            </>
          )}
        </ZUIFuture>
      </Box>
    </>
  );
};

AreaAssignmentReportPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default AreaAssignmentReportPage;
