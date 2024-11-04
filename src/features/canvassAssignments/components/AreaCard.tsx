import MapIcon from '@mui/icons-material/Map';
import { FC } from 'react';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import router from 'next/router';
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';

import theme from 'theme';
import { useNumericRouteParams } from 'core/hooks';
import {
  AreaCardData,
  ZetkinAssignmentAreaStatsItem,
  ZetkinCanvassAssignment,
} from '../types';

type AreaCardProps = {
  areas: ZetkinAssignmentAreaStatsItem[];
  assignment: ZetkinCanvassAssignment;
  data: AreaCardData[];
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

const AreaCard: FC<AreaCardProps> = ({ areas, assignment, data }) => {
  const { orgId } = useNumericRouteParams();

  const transformToNivoData = (areaData: AreaCardData): NivoSeries[] => {
    const householdVisitsSeries: NivoSeries = {
      data: areaData.data.map((point) => ({
        x: point.hour !== '0' ? `${point.date} ${point.hour}` : point.date,
        y: point.householdVisits,
      })),
      id: `Household Visits`,
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
        }/canvassassignments/${assignment.id}/plan`,
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
          (graphData) => graphData.area.id === area.areaId
        );
        const transformedData = areaData ? transformToNivoData(areaData) : [];
        return (
          <Grid key={area.areaId} item md={2} sm={4} xs={12}>
            <Card key={area.areaId} sx={{ height: 'auto', marginBottom: 2 }}>
              <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
              >
                <Box alignItems="center" display="flex">
                  <Typography padding={2} variant="h5">
                    {areaData?.area.title || 'Untitled area'}
                  </Typography>
                  <Divider
                    orientation="vertical"
                    sx={{ height: '30px', marginRight: 1 }}
                  />
                  <Typography color={theme.palette.primary.main} variant="h6">
                    {area.num_successful_visited_households}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() =>
                    areaData?.area.id ? navigateToArea(areaData?.area.id) : ''
                  }
                  sx={{ marginRight: 2 }}
                >
                  <MapIcon />
                </IconButton>
              </Box>
              <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
              <Box>
                {transformedData.length > 0 && (
                  <div style={{ height: '200px' }}>
                    <ResponsiveLine
                      animate={false}
                      axisBottom={null}
                      axisLeft={null}
                      colors={[
                        theme.palette.primary.light,
                        theme.palette.primary.dark,
                      ]}
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
                      margin={{ bottom: 20, left: 20, right: 20, top: 20 }}
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
                                    backgroundColor:
                                      dataPoint.serieId === 'Household Visits'
                                        ? theme.palette.primary.light
                                        : theme.palette.primary.dark,
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
                    />
                  </div>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-evenly"
                sx={{ margin: 2 }}
              >
                <Box textAlign="start">
                  <Typography sx={{ fontSize: 14 }}>
                    Households visited
                  </Typography>
                  <Typography color={theme.palette.primary.main} variant="h6">
                    {area.num_visited_households}
                  </Typography>
                </Box>
                <Box textAlign="start">
                  <Typography sx={{ fontSize: 14 }}>Places visited</Typography>
                  <Typography
                    color={theme.palette.secondary.light}
                    variant="h6"
                  >
                    {area.num_visited_places}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </>
  );
};

export default AreaCard;
