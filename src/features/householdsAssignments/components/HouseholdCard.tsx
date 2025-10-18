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
  HouseholdCardData,
  ZetkinAssignmentHouseholdStatsItem,
  ZetkinHouseholdAssignment,
} from '../types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type HouseholdCardProps = {
  assignment: ZetkinHouseholdAssignment;
  data: HouseholdCardData[];
  households: ZetkinAssignmentHouseholdStatsItem[];
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

const HouseholdCard: FC<HouseholdCardProps> = ({
  households,
  assignment,
  data,
  maxVisitedHouseholds,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const router = useRouter();

  const transformToNivoData = (
    householdData: HouseholdCardData
  ): NivoSeries[] => {
    const householdVisitsSeries: NivoSeries = {
      data: householdData.data.map((point) => ({
        x: point.hour !== '0' ? `${point.date} ${point.hour}` : point.date,
        y: point.householdVisits,
      })),
      id: messages.overview.progress.headers.households(),
    };

    const successfulVisitsSeries: NivoSeries = {
      data: householdData.data.map((point) => ({
        x: point.hour !== '0' ? `${point.date} ${point.hour}` : point.date,
        y: point.successfulVisits,
      })),
      id: messages.overview.progress.headers.successful(),
    };

    return [householdVisitsSeries, successfulVisitsSeries];
  };

  const navigateToHousehold = (householdId: number) => {
    router.replace(
      {
        pathname: `/organize/${orgId}/projects/${assignment.campId}/householdassignments/${assignment.id}/map`,
        query: { navigateToHouseholdId: householdId },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      {households.map((household) => {
        const householdData = data.find(
          (graphData) =>
            graphData.household_id === household.household_id ||
            graphData.household_id == null
        );
        const transformedData = householdData
          ? transformToNivoData(householdData)
          : [];
        return (
          <Grid
            key={household.household_id}
            size={{ lg: 3, md: 4, sm: 6, xs: 12 }}
          >
            <Card key={household.household_id} sx={{ height: 'auto' }}>
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
                      householdData?.household_id !== 0
                        ? oldTheme.palette.primary.dark
                        : oldTheme.palette.grey[900]
                    }
                    variant="h6"
                  >
                    {household.num_successful_visited_households}
                  </Typography>
                </Box>
                {household.household_id ? (
                  <IconButton
                    onClick={() =>
                      householdData?.household_id
                        ? navigateToHousehold(householdData.household_id)
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
                        householdData?.household_id
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
                        linearGradientDef('householdsVisited', [
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
                                      if (householdData?.household_id) {
                                        return dataPoint.serieId ===
                                          'householdsVisited'
                                          ? oldTheme.palette.primary.light
                                          : oldTheme.palette.primary.dark;
                                      } else {
                                        return dataPoint.serieId ===
                                          'householdsVisited'
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
                      {...(householdData?.household_id
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
                    <Msg id={messageIds.overview.progress.headers.households} />
                  </Typography>
                  <Typography
                    color={
                      householdData?.household_id
                        ? oldTheme.palette.primary.light
                        : oldTheme.palette.grey[400]
                    }
                    variant="h6"
                  >
                    {household.num_visited_households}
                  </Typography>
                </Box>
                {household.household_id && (
                  <Box textAlign="start">
                    <Typography sx={{ fontSize: 14 }}>
                      <Msg
                        id={messageIds.overview.progress.headers.locations}
                      />
                    </Typography>
                    <Typography
                      color={
                        householdData?.household_id
                          ? oldTheme.palette.secondary.light
                          : oldTheme.palette.grey[900]
                      }
                      variant="h6"
                    >
                      {household.num_visited_locations}
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

export default HouseholdCard;
