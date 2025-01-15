import {
  Close,
  Delete,
  Edit,
  LinearScale,
  SwitchLeft,
} from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

import { AREAS } from 'utils/featureFlags';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import MetricCard from 'features/areaAssignments/components/MetricCard';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import theme from 'theme';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import useAreaAssignmentMutations from 'features/areaAssignments/hooks/useAreaAssignmentMutations';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import {
  ZetkinAreaAssignment,
  ZetkinMetric,
} from 'features/areaAssignments/types';

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

interface AreaAssignmentLoggingProps {
  orgId: string;
  areaAssId: string;
}

const AreaAssignmentLoggingPage: PageWithLayout<AreaAssignmentLoggingProps> = ({
  orgId,
  areaAssId,
}) => {
  const { updateAreaAssignment } = useAreaAssignmentMutations(
    parseInt(orgId),
    areaAssId
  );
  const areaAssignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);

  const [metricBeingCreated, setMetricBeingCreated] =
    useState<ZetkinMetric | null>(null);
  const [metricBeingEdited, setMetricBeingEdited] =
    useState<ZetkinMetric | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [metricBeingDeleted, setMetricBeingDeleted] =
    useState<ZetkinMetric | null>(null);

  const handleSaveMetric = async (metric: ZetkinMetric) => {
    if (areaAssignmentFuture.data) {
      await updateAreaAssignment({
        metrics: areaAssignmentFuture.data.metrics
          .map((m: ZetkinMetric) => (m.id === metric.id ? metric : m))
          .concat(metric.id ? [] : [metric]),
      });
    }
    setMetricBeingEdited(null);
    setMetricBeingCreated(null);
  };

  const handleDeleteMetric = async (id: string) => {
    if (areaAssignmentFuture.data) {
      await updateAreaAssignment({
        metrics: areaAssignmentFuture.data.metrics.filter(
          (m: ZetkinMetric) => m.id !== id
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
    <ZUIFuture future={areaAssignmentFuture}>
      {(assignment: ZetkinAreaAssignment) => (
        <Box display="flex">
          <Box width="60%">
            <Box>
              {assignment.metrics.map((metric) => (
                <Card key={metric.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex">
                      <Box
                        display="flex"
                        flexDirection="column"
                        flexGrow={1}
                        gap={1}
                      >
                        <Box
                          alignItems="flex-start"
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Box alignItems="center" display="flex">
                            <Typography
                              display="flex"
                              gutterBottom
                              mr={1}
                              variant="h6"
                            >
                              {metric.kind == 'boolean' ? (
                                <Typography color="secondary" mr={1}>
                                  <SwitchLeft />
                                </Typography>
                              ) : (
                                <Typography color="secondary" mr={1}>
                                  <LinearScale />
                                </Typography>
                              )}
                              {metric.question || 'Untitled question'}
                            </Typography>
                          </Box>
                          <Box alignItems="center" display="flex">
                            {metric.definesDone && metric.kind === 'boolean' && (
                              <Box
                                bgcolor={alpha(
                                  theme.palette.success.light,
                                  0.5
                                )}
                                borderRadius={2}
                                display="flex"
                                mr={1}
                                p={0.5}
                              >
                                <Typography px={1}>Defines success</Typography>
                              </Box>
                            )}
                            <Button
                              onClick={() => setMetricBeingEdited(metric)}
                            >
                              <Edit />
                            </Button>

                            {assignment.metrics.length > 1 && (
                              <Button
                                onClick={(ev) => {
                                  setMetricBeingDeleted(metric);
                                  setAnchorEl(ev.currentTarget);
                                }}
                              >
                                <Delete />
                              </Button>
                            )}
                          </Box>
                        </Box>
                        <Typography color="secondary" ml={4}>
                          {metric.description || 'No description'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            {metricBeingCreated && (
              <Box mb={2} mt={2}>
                <MetricCard
                  metric={metricBeingCreated}
                  onClose={() => setMetricBeingCreated(null)}
                  onSave={handleSaveMetric}
                />
              </Box>
            )}
            {metricBeingEdited && (
              <Dialog
                onClose={() => setMetricBeingEdited(null)}
                open={metricBeingEdited ? true : false}
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <MetricCard
                  metric={metricBeingEdited}
                  onClose={() => setMetricBeingEdited(null)}
                  onSave={handleSaveMetric}
                />
              </Dialog>
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
                  Add questions for your canvass assignment.
                </Typography>
                <Box alignItems="center" display="flex" mt={2}>
                  <Button
                    onClick={() => handleAddNewMetric('boolean')}
                    startIcon={<SwitchLeft />}
                    sx={{ marginRight: 1 }}
                    variant="outlined"
                  >
                    Choice question
                  </Button>
                  <Button
                    onClick={() => handleAddNewMetric('scale5')}
                    startIcon={<LinearScale />}
                    variant="outlined"
                  >
                    Scale question
                  </Button>
                </Box>
              </Card>
              <Dialog onClose={() => setAnchorEl(null)} open={!!anchorEl}>
                <Box display="flex" flexDirection="column" gap={1} padding={2}>
                  <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">
                      {`Delete ${
                        assignment.metrics.find(
                          (metric) => metric.id === metricBeingDeleted?.id
                        )?.question || 'Untitled question'
                      }`}
                    </Typography>
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
                      {`If you want to delete "${metricBeingDeleted.question}" you need to pick another
                  choice question to be the question that defines if the mision
                  was successful`}
                    </Typography>
                  ) : (
                    <Typography>
                      Are you sure you want to delete this question? This action
                      is permanent and it cannot be undone.
                    </Typography>
                  )}

                  {metricBeingDeleted?.definesDone ? (
                    <Box display="flex" flexDirection="column" gap={1}>
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
                            {metric.question || 'Untitled question'}
                            <Button
                              onClick={() => {
                                if (metricBeingDeleted) {
                                  const filtered = assignment.metrics.filter(
                                    (metric) =>
                                      metric.id != metricBeingDeleted.id
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
          <Box ml={2} width="40%">
            <ZUICard
              header="Successful visit"
              subheader=" Question to use to count a visit as successful."
              sx={{ mb: 2 }}
            >
              <Divider />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Defines success</InputLabel>
                <Select
                  disabled={
                    assignment.metrics.filter(
                      (metric) => metric.kind === 'boolean'
                    ).length <= 1
                  }
                  label="Defines success"
                  onChange={(ev: SelectChangeEvent) => {
                    const updatedMetrics =
                      areaAssignmentFuture.data?.metrics.map(
                        (m: ZetkinMetric) => {
                          if (m.id === ev.target.value) {
                            return {
                              ...m,
                              definesDone: true,
                            };
                          } else {
                            return {
                              ...m,
                              definesDone: false,
                            };
                          }
                        }
                      );

                    updateAreaAssignment({
                      metrics: updatedMetrics,
                    });
                  }}
                  value={
                    assignment.metrics.find((metric) => metric.definesDone)
                      ?.id || ''
                  }
                >
                  {assignment.metrics.map((metric) =>
                    metric.kind === 'boolean' ? (
                      <MenuItem key={metric.id} value={metric.id}>
                        {metric.question}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
              </FormControl>
            </ZUICard>
            <ZUICard
              header="Data precision & privacy"
              subheader="Configuring where to store the data is a matter of striking a
                balance between precision and privacy that is right for your
                cause"
              sx={{ mb: 2 }}
            >
              <Divider />
              <FormControl>
                <RadioGroup
                  onChange={(ev) => {
                    const value = ev.target.value;
                    if (value === 'household' || value === 'location') {
                      updateAreaAssignment({
                        reporting_level: value,
                      });
                    }
                  }}
                  value={assignment.reporting_level}
                >
                  <Typography mt={1}>Collect data..</Typography>
                  <FormControlLabel
                    control={<Radio />}
                    label="per household (more precise)"
                    sx={{ ml: 1 }}
                    value="household"
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="per location (more privacy)"
                    sx={{ ml: 1 }}
                    value="location"
                  />
                </RadioGroup>
              </FormControl>
            </ZUICard>
          </Box>
        </Box>
      )}
    </ZUIFuture>
  );
};

AreaAssignmentLoggingPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default AreaAssignmentLoggingPage;
