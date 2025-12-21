import { FC } from 'react';
import { InfoOutlined } from '@mui/icons-material';
import { linearGradientDef } from '@nivo/core';
import MapIcon from '@mui/icons-material/Map';
import { ResponsiveLine } from '@nivo/line';
import { useRouter } from 'next/router';
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';

import oldTheme from 'theme';
import { useNumericRouteParams } from 'core/hooks';
import {
  VisitCardData,
  ZetkinVisitStatsItem,
  ZetkinVisitAssignment,
} from '../types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type VisitCardProps = {
  assignment: ZetkinVisitAssignment;
  data: VisitCardData[];
  maxVisits: number;
  visits: ZetkinVisitStatsItem[];
};

type NivoDataPoint = {
  hour?: string;
  x: string;
  y: number;
};

type NivoSeries = {
  data: NivoDataPoint[];
  id: string;
};

const VisitCard: FC<VisitCardProps> = ({
  visits,
  assignment,
  data,
  maxVisits,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const router = useRouter();

  const transformToNivoData = (visitData: VisitCardData): NivoSeries[] => {
    const visitsSeries: NivoSeries = {
      data: visitData.data.map((point) => ({
        x: point.hour !== '0' ? `${point.date} ${point.hour}` : point.date,
        y: point.numberOfVisits,
      })),
      id: messages.overview.progress.headers.visits(),
    };

    const successfulVisitsSeries: NivoSeries = {
      data: visitData.data.map((point) => ({
        x: point.hour !== '0' ? `${point.date} ${point.hour}` : point.date,
        y: point.successfulVisits,
      })),
      id: messages.overview.progress.headers.successful(),
    };

    return [visitsSeries, successfulVisitsSeries];
  };

  const navigateToVisit = (visitId: number) => {
    router.replace(
      {
        pathname: `/organize/${orgId}/projects/${assignment.campaign.id}/visitassignments/${assignment.id}/map`,
        query: { navigateToVisitId: visitId },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {visits.map((visit) => {
        const visitData = data.find(
          (graphData) =>
            graphData.visit_id === visit.visit_id || graphData.visit_id == null
        );
        const transformedData = visitData ? transformToNivoData(visitData) : [];
        return (
          <Grid key={visit.visit_id} size={{ lg: 3, md: 4, sm: 6, xs: 12 }}>
            <Card key={visit.visit_id} sx={{ height: 'auto' }}>
              <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                width="100%"
              >
                <Box alignItems="center" display="flex" width="70%">
                  <Typography
                    padding={2}
                    sx={{
                      maxWidth: '70%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    variant="h6"
                  >
                    <Msg
                      id={messageIds.overview.progress.unassignedVisits.title}
                    />
                  </Typography>
                  <Divider
                    orientation="vertical"
                    sx={{ height: '30px', marginRight: 1 }}
                  />
                  <Typography
                    color={
                      visitData?.visit_id !== 0
                        ? oldTheme.palette.primary.dark
                        : oldTheme.palette.grey[900]
                    }
                    variant="h6"
                  >
                    {visit.num_successful_visits}
                  </Typography>
                </Box>
                {visit.visit_id ? (
                  <IconButton
                    onClick={() =>
                      visitData?.visit_id
                        ? navigateToVisit(visitData.visit_id)
                        : ''
                    }
                  >
                    <MapIcon />
                  </IconButton>
                ) : (
                  <Tooltip
                    title={
                      <Msg
                        id={
                          messageIds.overview.progress.unassignedVisits
                            .description
                        }
                      />
                    }
                  >
                    <InfoOutlined
                      sx={{
                        color: oldTheme.palette.secondary.main,
                        marginRight: 1,
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
              <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
              <Box>
                {transformedData.length > 0 && (
                  <div style={{ height: '150px' }}>
                    <ResponsiveLine
                      animate={false}
                      axisBottom={null}
                      axisLeft={null}
                      colors={
                        visitData?.visit_id
                          ? [
                              oldTheme.palette.primary.light,
                              oldTheme.palette.primary.dark,
                            ]
                          : [
                              oldTheme.palette.grey[400],
                              oldTheme.palette.grey[900],
                            ]
                      }
                      data={transformedData}
                      defs={[
                        linearGradientDef('visits', [
                          { color: oldTheme.palette.primary.light, offset: 0 },
                          {
                            color: oldTheme.palette.primary.dark,
                            offset: 100,
                            opacity: 0,
                          },
                        ]),
                      ]}
                      enableGridX={false}
                      enableGridY={false}
                      enablePoints={false}
                      enableSlices="x"
                      isInteractive={true}
                      lineWidth={3}
                      margin={{ bottom: 10, left: 15, right: 15, top: 10 }}
                      sliceTooltip={(props) => {
                        return (
                          <Paper
                            style={{
                              backgroundColor:
                                oldTheme.palette.background.paper,
                              borderRadius: '3px',
                              padding: '5px',
                            }}
                          >
                            <Typography variant="h6">
                              {props.slice.points[0].data.xFormatted.toString()}
                            </Typography>
                            {props.slice.points.map((dataPoint, index) => (
                              <Box key={index}>
                                <Box
                                  sx={{
                                    backgroundColor: (() => {
                                      if (visitData?.visit_id) {
                                        return dataPoint.serieId === 'visits'
                                          ? oldTheme.palette.primary.light
                                          : oldTheme.palette.primary.dark;
                                      } else {
                                        return dataPoint.serieId === 'visits'
                                          ? oldTheme.palette.grey[400]
                                          : oldTheme.palette.grey[900];
                                      }
                                    })(),
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    height: '8px',
                                    marginRight: 1,
                                    offset: 0,
                                    width: '8px',
                                  }}
                                />
                                {dataPoint.serieId}
                                {':'} {dataPoint.data.yFormatted}
                              </Box>
                            ))}
                          </Paper>
                        );
                      }}
                      {...(visitData?.visit_id
                        ? {
                            yScale: {
                              max: maxVisits,
                              min: 0,
                              type: 'linear',
                            },
                          }
                        : null)}
                    />
                  </div>
                )}
              </Box>
              <Box display="flex" justifyContent="start" sx={{ margin: 1 }}>
                <Box marginLeft={1} marginRight={2} textAlign="start">
                  <Typography sx={{ fontSize: 14 }}>
                    <Msg id={messageIds.overview.progress.headers.visits} />
                  </Typography>
                  <Typography
                    color={
                      visitData?.visit_id
                        ? oldTheme.palette.primary.light
                        : oldTheme.palette.grey[400]
                    }
                    variant="h6"
                  >
                    {visit.num_successful_visits}
                  </Typography>
                </Box>
                {visit.visit_id && (
                  <Box textAlign="start">
                    <Typography sx={{ fontSize: 14 }}>
                      <Msg
                        id={messageIds.overview.progress.headers.locations}
                      />
                    </Typography>
                    <Typography
                      color={
                        visitData?.visit_id
                          ? oldTheme.palette.secondary.light
                          : oldTheme.palette.grey[900]
                      }
                      variant="h6"
                    >
                      {visit.num_visited_locations}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        );
      })}
    </>
  );
};

export default VisitCard;
