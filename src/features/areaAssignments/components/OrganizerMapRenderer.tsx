import { useTheme } from '@mui/styles';
import { DoorFront, Place } from '@mui/icons-material';
import {
  AttributionControl,
  FeatureGroup,
  Polygon,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { Box, Divider, lighten, Typography } from '@mui/material';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { FeatureGroup as FeatureGroupType } from 'leaflet';

import { assigneesFilterContext } from './OrganizerMapFilters/AssigneeFilterContext';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import isPointInsidePolygon from '../../canvass/utils/isPointInsidePolygon';
import { ZetkinArea } from 'features/areas/types';
import ZUIAvatar from 'zui/ZUIAvatar';
import {
  ZetkinAssignmentAreaStats,
  ZetkinAreaAssignee,
  ZetkinLocation,
} from '../types';
import { getBoundSize } from '../../canvass/utils/getBoundSize';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import { getVisitPercentage } from 'features/canvass/utils/getVisitPercentage';
import locToLatLng from 'features/geography/utils/locToLatLng';

const LocationMarker: FC<{
  areaAssId: number;
  location: ZetkinLocation;
  locationStyle: 'dot' | 'households' | 'progress';
}> = ({ areaAssId, location, locationStyle }) => {
  const theme = useTheme();
  if (locationStyle == 'dot') {
    return (
      <DivIconMarker
        iconAnchor={[2, 2]}
        position={locToLatLng(location)}
        zIndexOffset={-1000}
      >
        <Box
          bgcolor={theme.palette.text.primary}
          borderRadius="2em"
          height={6}
          width={6}
        />
      </DivIconMarker>
    );
  } else if (locationStyle == 'households') {
    return (
      <DivIconMarker iconAnchor={[6, 22]} position={locToLatLng(location)}>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          minWidth="15px"
        >
          <Box
            alignItems="center"
            bgcolor="white"
            borderRadius={1}
            boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
            color={theme.palette.text.secondary}
            display="inline-flex"
            flexDirection="column"
            fontSize="14px"
            justifyContent="center"
            paddingX="10px"
            width="100%"
          >
            {location.num_households || location.num_estimated_households}
          </Box>
          <div
            style={{
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid white',
              boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.3)',
              height: 0,
              width: 0,
            }}
          />
        </Box>
      </DivIconMarker>
    );
  } else {
    const percentage = getVisitPercentage(areaAssId, [], 0);

    return (
      <DivIconMarker iconAnchor={[6, 24]} position={locToLatLng(location)}>
        <MarkerIcon
          percentage={percentage}
          selected={false}
          uniqueKey={location.id}
        />
      </DivIconMarker>
    );
  }
};

type OrganizerMapRendererProps = {
  areaAssId: number;
  areaStats: ZetkinAssignmentAreaStats;
  areaStyle: 'households' | 'progress' | 'hide' | 'assignees' | 'outlined';
  areas: ZetkinArea[];
  locationStyle: 'dot' | 'households' | 'progress' | 'hide';
  locations: ZetkinLocation[];
  navigateToAreaId?: number;
  onSelectedIdChange: (newId: number) => void;
  overlayStyle: 'assignees' | 'households' | 'progress' | 'hide';
  selectedId: number;
  sessions: ZetkinAreaAssignee[];
};

const OrganizerMapRenderer: FC<OrganizerMapRendererProps> = ({
  areas,
  areaStats,
  areaStyle,
  areaAssId,
  locations,
  selectedId,
  sessions,
  navigateToAreaId,
  onSelectedIdChange,
  overlayStyle,
  locationStyle,
}) => {
  const theme = useTheme();
  const reactFGref = useRef<FeatureGroupType | null>(null);

  const [zoomed, setZoomed] = useState(false);
  const [zoom, setZoom] = useState(0);

  const map = useMapEvents({
    zoom: () => {
      setZoom(map.getZoom());
      setZoomed(true);
    },
  });

  //Get the group element that groups all the area svg:s
  //and lower its collective opacity, to avoid misleading
  //data colors on stacked areas.
  const gElement = map.getPanes().overlayPane.querySelector('g');
  if (gElement) {
    gElement.style.opacity = '0.6';
  }

  useEffect(() => {
    if (map && !zoomed) {
      if (navigateToAreaId) {
        const areaToNavigate = areas.find(
          (area) => area.id === navigateToAreaId
        );
        if (areaToNavigate) {
          map.fitBounds(areaToNavigate.points);
          setZoomed(true);
        }
      } else {
        const bounds = reactFGref.current?.getBounds();
        if (bounds?.isValid()) {
          map.fitBounds(bounds);
          setZoomed(true);
        }
      }
    }
  }, [areas, map]);

  const { assigneesFilter } = useContext(assigneesFilterContext);

  const getAreaColor = (
    hasPeople: boolean,
    householdColorPercent: number,
    visitsColorPercent: number
  ) => {
    if (areaStyle == 'hide' || areaStyle == 'outlined') {
      return 'transparent';
    }

    if (areaStyle == 'assignees') {
      return hasPeople
        ? theme.palette.primary.main
        : theme.palette.secondary.main;
    }

    if (areaStyle == 'progress' && !hasPeople) {
      return theme.palette.secondary.main;
    }

    return areaStyle == 'households'
      ? //TODO: Use theme colors for these
        `color-mix(in hsl, ${lighten(theme.palette.primary.main, 0.8)}, ${
          theme.palette.primary.main
        } ${householdColorPercent}%)`
      : `color-mix(in hsl,  ${lighten(theme.palette.primary.main, 0.8)}, ${
          theme.palette.primary.main
        } ${visitsColorPercent || 1}%)`;
  };

  const locationsByAreaId: Record<string, ZetkinLocation[]> = {};
  areas.forEach((area) => {
    locationsByAreaId[area.id] = [];

    locations.forEach((location) => {
      const isInsideArea = isPointInsidePolygon(
        locToLatLng(location),
        area.points.map((point) => ({
          lat: point[0],
          lng: point[1],
        }))
      );
      if (isInsideArea) {
        locationsByAreaId[area.id].push(location);
      }
    });
  });

  let highestHousholds = 0;
  Object.keys(locationsByAreaId).forEach((id) => {
    let numberOfHouseholdsInArea = 0;
    locationsByAreaId[id].forEach((location) => {
      numberOfHouseholdsInArea +=
        location.num_households || location.num_estimated_households;
    });

    if (numberOfHouseholdsInArea > highestHousholds) {
      highestHousholds = numberOfHouseholdsInArea;
    }
  });

  return (
    <>
      <AttributionControl position="bottomright" prefix={false} />
      <TileLayer
        attribution="<span style='color:#a3a3a3;'>Leaflet & OpenStreetMap</span>"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup
        ref={(fgRef) => {
          reactFGref.current = fgRef;
        }}
      >
        {areas
          .sort((a0, a1) => {
            // Always render selected last, so that it gets
            // rendered on top of the unselected ones in case
            // there are overlaps.
            if (a0.id == selectedId) {
              return 1;
            } else if (a1.id == selectedId) {
              return -1;
            } else {
              // When  none of the two areas are selected, sort them
              // by size, so that big ones are underneath and the
              // smaller ones can be clicked.
              return getBoundSize(a1) - getBoundSize(a0);
            }
          })
          .map((area) => {
            const selected = selectedId == area.id;

            const mid: [number, number] = [0, 0];
            if (area.points.length) {
              area.points
                .map((input) => {
                  if ('lat' in input && 'lng' in input) {
                    return [input.lat as number, input.lng as number];
                  } else {
                    return input;
                  }
                })
                .forEach((point) => {
                  mid[0] += point[0];
                  mid[1] += point[1];
                });

              mid[0] /= area.points.length;
              mid[1] /= area.points.length;
            }

            const detailed = zoom >= 15;

            const userIds = sessions
              .filter((session) => session.area_id == area.id)
              .map((session) => session.user_id);

            const hasPeople = !!userIds.length;

            if (hasPeople && assigneesFilter == 'unassigned') {
              return null;
            } else if (!hasPeople && assigneesFilter == 'assigned') {
              return null;
            }

            // The key changes when selected, to force redraw of polygon
            // to reflect new state through visual style
            const key =
              area.id +
              (selected ? '-selected' : '-default') +
              `-${areaStyle}` +
              (hasPeople ? '-assigned' : '');

            const stats = areaStats.stats.find(
              (stat) => stat.area_id == area.id
            );

            let numberOfHouseholds = 0;
            locationsByAreaId[area.id].forEach(
              (location) =>
                (numberOfHouseholds +=
                  location.num_households || location.num_estimated_households)
            );
            const numberOfLocations = locationsByAreaId[area.id].length;

            const householdColorPercent =
              (numberOfHouseholds / highestHousholds) * 100;

            const visitsColorPercent = stats?.num_households
              ? (stats.num_visited_households / stats.num_households) * 100
              : 0;

            const successfulVisitsColorPercent = stats?.num_households
              ? (stats.num_successful_visited_households /
                  stats.num_households) *
                100
              : 0;

            return (
              <>
                {overlayStyle == 'households' && (
                  <DivIconMarker
                    iconAnchor={[0, 0]}
                    position={mid}
                    zIndexOffset={100}
                  >
                    <Box
                      alignItems="center"
                      bgcolor="white"
                      borderRadius={1}
                      boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
                      display="inline-flex"
                      flexDirection="column"
                      gap="2px"
                      padding="2px 6px"
                      sx={{ translate: '-50% -50%' }}
                    >
                      <Typography
                        alignItems="center"
                        display="flex"
                        fontSize="14px"
                      >
                        <DoorFront
                          fontSize="small"
                          sx={{ color: theme.palette.grey[300] }}
                        />
                        {numberOfHouseholds}
                      </Typography>
                      <Divider
                        sx={{
                          width: '100%',
                        }}
                      />
                      <Typography
                        alignItems="center"
                        display="flex"
                        fontSize="14px"
                      >
                        <Place
                          fontSize="small"
                          sx={{ color: theme.palette.grey[300] }}
                        />

                        {numberOfLocations}
                      </Typography>
                    </Box>
                  </DivIconMarker>
                )}
                {overlayStyle == 'progress' && stats && (
                  <DivIconMarker
                    iconAnchor={[0, 0]}
                    position={mid}
                    zIndexOffset={100}
                  >
                    <Box
                      bgcolor="white"
                      borderRadius={1}
                      boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
                      display="inline-flex"
                      flexDirection="column"
                      padding={0.5}
                      sx={{ translate: '-50% -50%' }}
                    >
                      <div
                        style={{
                          alignItems: 'center',
                          background: `conic-gradient(${
                            theme.palette.primary.main
                          } ${successfulVisitsColorPercent}%, ${lighten(
                            theme.palette.primary.main,
                            0.7
                          )} ${successfulVisitsColorPercent}% ${visitsColorPercent}%, ${
                            theme.palette.grey[400]
                          } ${visitsColorPercent}%)`,
                          borderRadius: '2em',
                          display: 'flex',
                          flexDirection: 'row',
                          height: '30px',
                          justifyContent: 'center',
                          width: '30px',
                        }}
                      />
                    </Box>
                  </DivIconMarker>
                )}
                {overlayStyle == 'assignees' && hasPeople && (
                  <DivIconMarker
                    iconAnchor={[0, 0]}
                    position={mid}
                    zIndexOffset={100}
                  >
                    {detailed && (
                      <Box
                        alignItems="center"
                        display="inline-flex"
                        flexWrap="wrap"
                        gap="2px"
                        justifyContent="center"
                        sx={{
                          pointerEvents: 'none',
                          transform: 'translate(-50%, -50%)',
                        }}
                        width={zoom >= 16 ? '95px' : '65px'}
                      >
                        {userIds.map((userId, index) => {
                          if (index <= 4) {
                            return (
                              <Box
                                key={userId}
                                sx={{
                                  borderRadius: '50%',
                                  boxShadow: '0 0 8px rgba(0,0,0,0.3)',
                                }}
                              >
                                <ZUIAvatar
                                  size={zoom >= 16 ? 'sm' : 'xs'}
                                  url={`/api/users/${userId}/avatar`}
                                />
                              </Box>
                            );
                          } else if (index == 5) {
                            return (
                              <Box
                                alignItems="center"
                                bgcolor="white"
                                borderRadius="100%"
                                display="flex"
                                height={zoom >= 16 ? '30px' : '20px'}
                                justifyContent="center"
                                padding={1}
                                sx={{ boxShadow: '0 0 8px rgba(0,0,0,0.3)' }}
                                width={zoom >= 16 ? '30px' : '20px'}
                              >
                                <Typography
                                  color="secondary"
                                  fontSize={zoom >= 16 ? 14 : 11}
                                >{`+${userIds.length - 5}`}</Typography>
                              </Box>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </Box>
                    )}
                    {!detailed && (
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: 10,
                          boxShadow: '0 0 8px rgba(0,0,0,0.3)',
                          color: theme.palette.primary.contrastText,
                          display: 'flex',
                          fontWeight: 'bold',
                          height: 30,
                          justifyContent: 'center',
                          pointerEvents: 'none',
                          transform: 'translate(-50%, -50%)',
                          width: 30,
                        }}
                      >
                        <Box>{userIds.length}</Box>
                      </Box>
                    )}
                  </DivIconMarker>
                )}
                <Polygon
                  key={key}
                  color={areaStyle == 'hide' ? '' : 'black'}
                  dashArray={!hasPeople ? '5px 7px' : ''}
                  eventHandlers={{
                    click: () => {
                      onSelectedIdChange(selected ? 0 : area.id);
                    },
                  }}
                  fillColor={getAreaColor(
                    hasPeople,
                    householdColorPercent,
                    visitsColorPercent
                  )}
                  fillOpacity={1}
                  interactive={areaStyle != 'hide'}
                  positions={area.points}
                  weight={selected ? 5 : 2}
                />
              </>
            );
          })}
        {locationStyle != 'hide' &&
          locations.map((location) => {
            //Find ids of area/s that the location is in
            const areaIds: number[] = [];
            areas.forEach((area) => {
              const isInsideArea = isPointInsidePolygon(
                locToLatLng(location),
                area.points.map((point) => ({
                  lat: point[0],
                  lng: point[1],
                }))
              );

              if (isInsideArea) {
                areaIds.push(area.id);
              }
            });

            //See if any of those areas have assignees in this assignment
            let idOfAreaInThisAssignment = 0;
            for (let i = 0; i < areaIds.length; i++) {
              const id = areaIds[i];
              const people = sessions
                .filter((session) => session.area_id == id)
                .map((session) => session.user_id);

              const hasPeople = !!people.length;

              if (hasPeople) {
                idOfAreaInThisAssignment = id;
                break;
              }
            }

            //Check if the location has housholds with visits in this assignment
            // TODO: This will require a better solution
            const hasVisitsInThisAssignment = false;
            /*
            const hasVisitsInThisAssignment = location.households.some(
              (household) =>
                !!household.visits.find(
                  (visit) => visit.assignment_id == areaAssId
                )
            );
            */

            //If user wants to see progress of locations,
            //don't show locations outside of assigned areas
            //unless they have visits in this assignment
            const hideFromProgressView =
              locationStyle == 'progress' &&
              !idOfAreaInThisAssignment &&
              !hasVisitsInThisAssignment;

            if (hideFromProgressView) {
              return null;
            }

            return (
              <LocationMarker
                key={location.id}
                areaAssId={areaAssId}
                location={location}
                locationStyle={locationStyle}
              />
            );
          })}
      </FeatureGroup>
    </>
  );
};

export default OrganizerMapRenderer;
