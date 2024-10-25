import MapIcon from '@mui/icons-material/Map';
import { FC } from 'react';
import { FormattedDate } from 'react-intl';
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
  GraphData,
  ZetkinAssignmentAreaStatsItem,
  ZetkinCanvassAssignment,
} from '../types';

type AreaCardProps = {
  areas: ZetkinAssignmentAreaStatsItem[];
  assignment: ZetkinCanvassAssignment;
  data: GraphData[];
};

const AreaCard: FC<AreaCardProps> = ({ areas, assignment, data }) => {
  const { orgId } = useNumericRouteParams();

  const transformToNivoData = (graphDataArray: GraphData[]) => {
    const householdsVisitedData: { x: string; y: number }[] = [];
    const successfulVisitsData: { x: string; y: number }[] = [];

    // Iterate through each GraphData object in the array
    graphDataArray.forEach((graphData) => {
      graphData.householdsVisited
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .forEach((item) => {
          householdsVisitedData.push({
            x: item.date,
            y: item.accumulatedVisits,
          });
        });
      graphData.successfulVisits
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .forEach((item) => {
          successfulVisitsData.push({
            x: item.date,
            y: item.accumulatedVisits,
          });
        });
    });

    return [
      {
        data: householdsVisitedData,
        id: 'householdsVisited',
      },
      {
        data: successfulVisitsData,
        id: 'successfulVisits',
      },
    ];
  };

  return (
    <>
      {areas.map((area) => {
        const areaData = data.find(
          (graphData) => graphData.areaId === area.areaId
        );
        const transformedData = areaData ? transformToNivoData([areaData]) : [];
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
                    {'Untitled area'}
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
                    router.push(
                      `/organize/${orgId}/projects/${
                        assignment.campaign.id || ''
                      }/canvassassignments/${assignment.id}/plan`
                    )
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
                        const dataPoint = props.slice.points;

                        return (
                          <Paper>
                            <Box p={1}>
                              <Typography variant="h6">
                                <FormattedDate
                                  value={dataPoint[0].data.xFormatted}
                                />
                              </Typography>
                              <Typography variant="body2">
                                {dataPoint.map((point) => {
                                  return (
                                    <Typography key={point.id}>
                                      {point.serieId} {point.data.y as number}
                                    </Typography>
                                  );
                                })}
                              </Typography>
                            </Box>
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
                sx={{ marginBottom: 2, marginTop: 2 }}
              >
                <Box textAlign="start">
                  <Typography>Households visited</Typography>
                  <Typography color={theme.palette.primary.main} variant="h6">
                    {area.num_visited_households}
                  </Typography>
                </Box>
                <Box textAlign="start">
                  <Typography>Places visited</Typography>
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
