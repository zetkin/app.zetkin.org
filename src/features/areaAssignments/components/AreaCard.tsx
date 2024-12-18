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

import theme from 'theme';
import { useNumericRouteParams } from 'core/hooks';
import {
  AreaCardData,
  ZetkinAssignmentAreaStatsItem,
  ZetkinAreaAssignment,
} from '../types';

type AreaCardProps = {
  areas: ZetkinAssignmentAreaStatsItem[];
  assignment: ZetkinAreaAssignment;
  data: AreaCardData[];
  maxVisitedHouseholds: number;
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

const AreaCard: FC<AreaCardProps> = ({
  areas,
  assignment,
  data,
  maxVisitedHouseholds,
}) => {
  const { orgId } = useNumericRouteParams();
  const router = useRouter();

  const transformToNivoData = (areaData: AreaCardData): NivoSeries[] => {
    const householdVisitsSeries: NivoSeries = {
      data: areaData.data.map((point) => ({
        x: point.hour !== '0' ? `${point.date} ${point.hour}` : point.date,
        y: point.householdVisits,
      })),
      id: `Households Visited`,
    };

    const successfulVisitsSeries: NivoSeries = {
      data: areaData.data.map((point) => ({
        x: point.hour !== '0' ? `${point.date} ${point.hour}` : point.date,
        y: point.successfulVisits,
      })),
      id: `Successful Visits`,
    };

    return [householdVisitsSeries, successfulVisitsSeries];
  };

  const navigateToArea = (areaId: string) => {
    router.replace(
      {
        pathname: `/organize/${orgId}/projects/${
          assignment.campaign.id || ''
        }/areaassignments/${assignment.id}/map`,
        query: { navigateToAreaId: areaId },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {areas.map((area) => {
        const areaData = data.find(
          (graphData) =>
            graphData.area.id === area.areaId || graphData.area.id === 'noArea'
        );
        const transformedData = areaData ? transformToNivoData(areaData) : [];
        return (
          <Grid key={area.areaId} item lg={3} md={4} sm={6} xs={12}>
            <Card key={area.areaId} sx={{ height: 'auto' }}>
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
                    {areaData?.area.id !== 'noArea'
                      ? areaData?.area.title || 'Untitled area'
                      : 'Unassigned visits'}
                  </Typography>
                  <Divider
                    orientation="vertical"
                    sx={{ height: '30px', marginRight: 1 }}
                  />
                  <Typography
                    color={
                      areaData?.area.id !== 'noArea'
                        ? theme.palette.primary.dark
                        : theme.palette.grey[900]
                    }
                    variant="h6"
                  >
                    {area.num_successful_visited_households}
                  </Typography>
                </Box>
                {area.areaId !== 'noArea' ? (
                  <IconButton
                    onClick={() =>
                      areaData?.area.id ? navigateToArea(areaData?.area.id) : ''
                    }
                  >
                    <MapIcon />
                  </IconButton>
                ) : (
                  <Tooltip title="This graph gathers the visits made outside the assigned areas">
                    <InfoOutlined
                      sx={{
                        color: theme.palette.secondary.main,
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
                        areaData?.area.id !== 'noArea'
                          ? [
                              theme.palette.primary.light,
                              theme.palette.primary.dark,
                            ]
                          : [theme.palette.grey[400], theme.palette.grey[900]]
                      }
                      data={transformedData}
                      defs={[
                        linearGradientDef('Households visited', [
                          { color: theme.palette.primary.light, offset: 0 },
                          {
                            color: theme.palette.primary.dark,
                            offset: 100,
                            opacity: 0,
                          },
                        ]),
                      ]}
                      enableArea={true}
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
                              backgroundColor: theme.palette.background.paper,
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
                                      if (areaData?.area.id !== 'noArea') {
                                        return dataPoint.serieId ===
                                          'Household Visits'
                                          ? theme.palette.primary.light
                                          : theme.palette.primary.dark;
                                      } else {
                                        return dataPoint.serieId ===
                                          'Household Visits'
                                          ? theme.palette.grey[400]
                                          : theme.palette.grey[900];
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
                      {...(areaData?.area.id !== 'noArea'
                        ? {
                            yScale: {
                              max: maxVisitedHouseholds,
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
                    Households visited
                  </Typography>
                  <Typography
                    color={
                      areaData?.area.id !== 'noArea'
                        ? theme.palette.primary.light
                        : theme.palette.grey[400]
                    }
                    variant="h6"
                  >
                    {area.num_visited_households}
                  </Typography>
                </Box>
                {area.areaId !== 'noArea' && (
                  <Box textAlign="start">
                    <Typography sx={{ fontSize: 14 }}>
                      Places visited
                    </Typography>
                    <Typography
                      color={
                        areaData?.area.id !== 'noArea'
                          ? theme.palette.secondary.light
                          : theme.palette.grey[900]
                      }
                      variant="h6"
                    >
                      {area.num_visited_places}
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

export default AreaCard;
