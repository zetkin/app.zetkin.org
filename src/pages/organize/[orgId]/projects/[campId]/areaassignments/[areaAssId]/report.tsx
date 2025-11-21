import {
  Close,
  Delete,
  Edit,
  LinearScale,
  SwitchLeft,
} from '@mui/icons-material';
import { GetServerSideProps } from 'next';
import { useContext, useState } from 'react';
import {
  alpha,
  Badge,
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
} from '@mui/material';
import { omit } from 'lodash';
import Head from 'next/head';

import { AREAS } from 'utils/featureFlags';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import messagesIds from 'features/areaAssignments/l10n/messageIds';
import MetricCard from 'features/areaAssignments/components/MetricCard';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import useAreaAssignmentMutations from 'features/areaAssignments/hooks/useAreaAssignmentMutations';
import useAreaAssignmentStats from 'features/areaAssignments/hooks/useAreaAssignmentStats';
import ZUICard from 'zui/ZUICard';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';
import {
  ZetkinAreaAssignment,
  ZetkinMetric,
} from 'features/areaAssignments/types';
import useAreaAssignmentMetrics from 'features/areaAssignments/hooks/useAreaAssignmentMetrics';
import ZUILockCard from 'zui/ZUILockCard';
import sortMetrics from 'features/canvass/utils/sortMetrics';

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
  areaAssId: number;
}

const AreaAssignmentReportPage: PageWithLayout<AreaAssignmentReportProps> = ({
  orgId,
  areaAssId,
}) => {
  const theme = useTheme();
  const { addMetric, deleteMetric, updateAreaAssignment, updateMetric } =
    useAreaAssignmentMutations(parseInt(orgId), areaAssId);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const areaAssignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);
  const areaAssignmentStats = useAreaAssignmentStats(
    parseInt(orgId),
    areaAssId
  ).data;
  const messages = useMessages(messagesIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const metricsList = useAreaAssignmentMetrics(parseInt(orgId), areaAssId);
  const metrics = sortMetrics(metricsList);

  const [metricBeingCreated, setMetricBeingCreated] =
    useState<Partial<ZetkinMetric> | null>(null);
  const [metricBeingEdited, setMetricBeingEdited] =
    useState<ZetkinMetric | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [metricBeingDeleted, setMetricBeingDeleted] =
    useState<ZetkinMetric | null>(null);

  const handleSaveMetric = async (metric: Partial<ZetkinMetric>) => {
    if (metric.id) {
      updateMetric(metric.id, omit(metric, 'id'));
    } else {
      addMetric(metric);
    }
    setMetricBeingEdited(null);
    setMetricBeingCreated(null);
  };

  const handleDeleteMetric = async (id: number) => {
    if (areaAssignmentFuture.data) {
      await deleteMetric(id);
    }
    setMetricBeingEdited(null);
  };

  const handleAddNewMetric = (type: 'bool' | 'scale5') => {
    setMetricBeingCreated({
      defines_success: false,
      question: '',
      type: type,
    });
  };

  const [unlocked, setUnlocked] = useState(false);
  const isReportEditable = !areaAssignmentFuture.data?.start_date || unlocked;

  return (
    <>
      <Head>
        <title>{areaAssignmentFuture.data?.title}</title>
      </Head>
      <ZUIFuture future={areaAssignmentFuture}>
        {(assignment: ZetkinAreaAssignment) => (
          <Grid
            container
            direction={isMobile ? 'column-reverse' : 'row'}
            spacing={2}
          >
            <Grid size={{ md: 8, xs: 12 }}>
              <Box>
                {metrics.map((metric) => (
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
                                {metric.type == 'bool' ? (
                                  <Typography color="secondary" mr={1}>
                                    <SwitchLeft />
                                  </Typography>
                                ) : (
                                  <Typography color="secondary" mr={1}>
                                    <LinearScale />
                                  </Typography>
                                )}
                                {metric.question ||
                                  messages.report.card.question()}
                              </Typography>
                            </Box>
                            <Box alignItems="center" display="flex">
                              {metric.defines_success &&
                                metric.type === 'bool' && (
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
                                    <Typography px={1}>
                                      <Msg
                                        id={
                                          messagesIds.report.card.definesSuccess
                                        }
                                      />
                                    </Typography>
                                  </Box>
                                )}
                              {isReportEditable && (
                                <IconButton
                                  color="secondary"
                                  onClick={() => setMetricBeingEdited(metric)}
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              {isReportEditable &&
                                (metric.type === 'scale5' ||
                                  (metric.type === 'bool' &&
                                    metrics.filter((m) => m.type === 'bool')
                                      .length > 1)) && (
                                  <IconButton
                                    color="secondary"
                                    onClick={(ev) => {
                                      if (metric.defines_success) {
                                        setMetricBeingDeleted(metric);
                                        setAnchorEl(ev.currentTarget);
                                      } else {
                                        showConfirmDialog({
                                          onCancel: () => {
                                            setMetricBeingDeleted(null);
                                            setAnchorEl(null);
                                          },
                                          onSubmit: () => {
                                            handleDeleteMetric(metric.id);
                                            setAnchorEl(null);
                                            setMetricBeingDeleted(null);
                                          },
                                          title: `${
                                            messages.report.card.delete() +
                                            ' ' +
                                            metric.question
                                          }`,
                                          warningText:
                                            messages.report.delete.dialog(),
                                        });
                                      }
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                )}
                              {isReportEditable &&
                                metrics.filter(
                                  (metric) => metric.type === 'bool'
                                ).length <= 1 &&
                                metric.type == 'bool' && (
                                  <Tooltip
                                    title={messages.report.card.tooltip()}
                                  >
                                    <Delete color="disabled" sx={{ mx: 1 }} />
                                  </Tooltip>
                                )}
                            </Box>
                          </Box>
                          <Typography color="secondary" ml={4}>
                            {metric.description ||
                              messages.report.card.description()}
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
                {isReportEditable && (
                  <Card
                    sx={{
                      backgroundColor: theme.palette.grey[200],
                      border: 'none',
                      marginTop: 2,
                      padding: 2,
                    }}
                  >
                    <Typography color="secondary">
                      <Msg id={messagesIds.report.toolBar.title} />
                    </Typography>
                    <Box alignItems="center" display="flex" mt={2}>
                      <Button
                        onClick={() => handleAddNewMetric('bool')}
                        startIcon={<SwitchLeft />}
                        sx={{ marginRight: 1 }}
                        variant="outlined"
                      >
                        <Msg id={messagesIds.report.metricCard.choice} />
                      </Button>
                      <Button
                        onClick={() => handleAddNewMetric('scale5')}
                        startIcon={<LinearScale />}
                        variant="outlined"
                      >
                        <Msg id={messagesIds.report.metricCard.scale} />
                      </Button>
                    </Box>
                  </Card>
                )}
                <Dialog onClose={() => setAnchorEl(null)} open={!!anchorEl}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    padding={2}
                  >
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">
                        {`${
                          messages.report.card.delete() +
                            ' ' +
                            metrics.find(
                              (metric) => metric.id === metricBeingDeleted?.id
                            )?.question || messages.report.card.question()
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
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography>
                        <Msg
                          id={messagesIds.report.delete.deleteWarningText}
                          values={{
                            title:
                              metricBeingDeleted?.question ||
                              messages.report.card.question(),
                          }}
                        />
                      </Typography>
                      {metrics
                        .filter(
                          (metric) =>
                            metric.type == 'bool' &&
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
                            {metric.question || messages.report.card.question()}
                            <Button
                              onClick={async () => {
                                if (metricBeingDeleted?.defines_success) {
                                  await deleteMetric(metricBeingDeleted.id);
                                  await updateMetric(metric.id, {
                                    defines_success: true,
                                  });
                                }
                                setAnchorEl(null);
                                setMetricBeingDeleted(null);
                              }}
                              variant="outlined"
                            >
                              <Msg id={messagesIds.report.delete.select} />
                            </Button>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                </Dialog>
              </Box>
            </Grid>
            <Grid size={{ md: 4, xs: 12 }}>
              {assignment.start_date && (
                <ZUILockCard
                  isActive={unlocked}
                  lockedHeader={messages.report.lockCard.header()}
                  lockedSubheader={messages.report.lockCard.description()}
                  onToggle={setUnlocked}
                  tips={{
                    safe: {
                      bullets: [
                        messages.report.lockCard.fix(),
                        messages.report.lockCard.add(),
                      ],
                      header: messages.report.lockCard.safe(),
                      iconType: 'check',
                    },
                    unsafe: {
                      bullets: [
                        messages.report.lockCard.rename(),
                        messages.report.lockCard.change(),
                      ],
                      header: messages.report.lockCard.unsafe(),
                      iconType: 'close',
                    },
                  }}
                  unlockedHeader={messages.report.lockCard.headerUnlock()}
                  unlockedSubheader={messages.report.lockCard.descriptionUnlock()}
                />
              )}
              <ZUICard
                header={messages.report.successCard.header()}
                subheader={messages.report.successCard.subheader()}
                sx={{ mb: 2 }}
              >
                <Divider />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>
                    {messages.report.card.definesSuccess()}
                  </InputLabel>
                  <Select
                    disabled={
                      !isReportEditable ||
                      metrics.filter(
                        (metric) =>
                          metric.type === 'bool' && !metric.defines_success
                      ).length < 1
                    }
                    label={messages.report.card.definesSuccess()}
                    onChange={async (ev: SelectChangeEvent) => {
                      const prevSuccessMetric = metrics.find(
                        (metric) => metric.defines_success
                      );
                      if (prevSuccessMetric) {
                        await updateMetric(prevSuccessMetric.id, {
                          defines_success: false,
                        });
                      }

                      await updateMetric(parseInt(ev.target.value), {
                        defines_success: true,
                      });
                    }}
                    value={
                      metrics
                        .find((metric) => metric.defines_success)
                        ?.id.toString() || ''
                    }
                  >
                    {metrics.map((metric) =>
                      metric.type === 'bool' ? (
                        <MenuItem key={metric.id} value={metric.id}>
                          {metric.question}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </ZUICard>
              <ZUICard
                header={messages.report.dataCard.header()}
                subheader={messages.report.dataCard.subheader()}
                sx={{ mb: 2 }}
              >
                <Divider />
                <FormControl fullWidth>
                  <RadioGroup
                    onChange={(ev) => {
                      const value = ev.target.value;
                      if (value === 'household' || value === 'location') {
                        updateAreaAssignment({
                          reporting_level: value,
                        });
                      }
                    }}
                    sx={{ mr: 2 }}
                    value={assignment.reporting_level}
                  >
                    <Typography mt={1}>
                      <Msg id={messagesIds.report.dataCard.info} />
                    </Typography>
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <FormControlLabel
                        control={<Radio disabled={!isReportEditable} />}
                        label={messages.report.dataCard.household()}
                        sx={{ ml: 1 }}
                        value="household"
                      />
                      {unlocked && (
                        <Badge
                          badgeContent={
                            areaAssignmentStats?.num_households_visited
                          }
                          color="secondary"
                        />
                      )}
                    </Box>
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <FormControlLabel
                        control={<Radio disabled={!isReportEditable} />}
                        label={messages.report.dataCard.location()}
                        sx={{ ml: 1 }}
                        value="location"
                      />
                      {unlocked && (
                        <Badge
                          badgeContent={
                            areaAssignmentStats?.num_locations_visited
                          }
                          color="secondary"
                        />
                      )}
                    </Box>
                  </RadioGroup>
                </FormControl>
              </ZUICard>
            </Grid>
          </Grid>
        )}
      </ZUIFuture>
    </>
  );
};

AreaAssignmentReportPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default AreaAssignmentReportPage;
