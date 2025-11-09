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
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
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

import { HOUSEHOLDS2 } from 'utils/featureFlags';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import HouseholdAssignmentLayout from 'features/householdsAssignments/layouts/HouseholdAssignmentLayout';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/householdsAssignments/l10n/messageIds';
import useHouseholdAssignment from 'features/householdsAssignments/hooks/useHouseholdAssignment';
import { ZetkinHouseholdAssignment } from 'features/householdsAssignments/types';
import { ZetkinMetric } from 'features/householdsAssignments/types';
import useHouseholdAssignmentMetrics from 'features/householdsAssignments/hooks/useHouseholdAssignmentMetrics';
import useHouseholdAssignmentMutations from 'features/householdsAssignments/hooks/useHouseholdAssignmentMutations';
import ZUIFuture from 'zui/ZUIFuture';
import ZUICard from 'zui/ZUICard';
import ZUILockCard from 'zui/ZUILockCard';
import MetricCard from 'features/areaAssignments/components/MetricCard';
import { ZUIConfirmDialogContext } from 'zui/ZUIConfirmDialogProvider';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [HOUSEHOLDS2],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, householdsAssId } = ctx.params!;

  return {
    props: {
      assignmentId: householdsAssId,
      campId,
      orgId,
    },
  };
}, scaffoldOptions);

const ReportPage: PageWithLayout = () => {
  const { orgId, campId, householdsAssId } = useNumericRouteParams();
  const theme = useTheme();
  const onServer = useServerSide();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const messages = useMessages(messageIds);
  const { showConfirmDialog } = useContext(ZUIConfirmDialogContext);
  const { householdsAssignmentFuture } = useHouseholdAssignment(
    campId,
    orgId,
    householdsAssId
  );
  const { addMetric, deleteMetric, updateMetric } =
    useHouseholdAssignmentMutations(campId, orgId, householdsAssId);
  const metricsList = useHouseholdAssignmentMetrics(
    campId,
    orgId,
    householdsAssId
  );

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
    if (householdsAssignmentFuture.data) {
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
  const isReportEditable =
    !householdsAssignmentFuture.data?.start_date || unlocked;

  if (onServer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{householdsAssignmentFuture.data?.title}</title>
      </Head>
      <ZUIFuture future={householdsAssignmentFuture}>
        {(assignment: ZetkinHouseholdAssignment) => (
          <Grid
            container
            direction={isMobile ? 'column-reverse' : 'row'}
            spacing={2}
          >
            <Grid size={{ md: 8, xs: 12 }}>
              <Box>
                {metricsList.map((metric) => (
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
                                          messageIds.report.card.definesSuccess
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
                                    metricsList.filter((m) => m.type === 'bool')
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
                                metricsList.filter(
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
                      <Msg id={messageIds.report.toolBar.title} />
                    </Typography>
                    <Box alignItems="center" display="flex" mt={2}>
                      <Button
                        onClick={() => handleAddNewMetric('bool')}
                        startIcon={<SwitchLeft />}
                        sx={{ marginRight: 1 }}
                        variant="outlined"
                      >
                        <Msg id={messageIds.report.metricCard.choice} />
                      </Button>
                      <Button
                        onClick={() => handleAddNewMetric('scale5')}
                        startIcon={<LinearScale />}
                        variant="outlined"
                      >
                        <Msg id={messageIds.report.metricCard.scale} />
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
                            metricsList.find(
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
                          id={messageIds.report.delete.deleteWarningText}
                          values={{
                            title:
                              metricBeingDeleted?.question ||
                              messages.report.card.question(),
                          }}
                        />
                      </Typography>
                      {metricsList
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
                              <Msg id={messageIds.report.delete.select} />
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
                      metricsList.filter(
                        (metric) =>
                          metric.type === 'bool' && !metric.defines_success
                      ).length < 1
                    }
                    label={messages.report.card.definesSuccess()}
                    onChange={async (ev: SelectChangeEvent) => {
                      const prevSuccessMetric = metricsList.find(
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
                      metricsList
                        .find((metric) => metric.defines_success)
                        ?.id.toString() || ''
                    }
                  >
                    {metricsList.map((metric) =>
                      metric.type === 'bool' ? (
                        <MenuItem key={metric.id} value={metric.id}>
                          {metric.question}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
              </ZUICard>
            </Grid>
          </Grid>
        )}
      </ZUIFuture>
    </>
  );
};

ReportPage.getLayout = function getLayout(page) {
  return <HouseholdAssignmentLayout>{page}</HouseholdAssignmentLayout>;
};

export default ReportPage;
