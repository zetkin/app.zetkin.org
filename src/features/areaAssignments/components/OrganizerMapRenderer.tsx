import { useTheme } from '@mui/styles';
import {
  AttributionControl,
  FeatureGroup,
  Polygon,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { Box, Divider, lighten, Typography } from '@mui/material';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { FeatureGroup as FeatureGroupType, latLngBounds } from 'leaflet';

import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import ZUIAvatar from 'zui/ZUIAvatar';
import {
  ZetkinAssignmentAreaStats,
  ZetkinAreaAssignment,
  ZetkinAreaAssignmentSession,
  ZetkinLocation,
} from '../types';
import { ZetkinArea } from 'features/areas/types';
import objToLatLng from 'features/areas/utils/objToLatLng';
import { assigneesFilterContext } from './OrganizerMapFilters/AssigneeFilterContext';
import isPointInsidePolygon from '../../canvass/utils/isPointInsidePolygon';

const LocationMarker: FC<{
  areaAssId: string;
  idOfMetricThatDefinesDone: string;
  location: ZetkinLocation;
  locationStyle: 'dot' | 'households' | 'progress';
}> = ({ areaAssId, idOfMetricThatDefinesDone, location, locationStyle }) => {
  const theme = useTheme();
  if (locationStyle == 'dot') {
    return (
      <DivIconMarker iconAnchor={[2, 2]} position={location.position}>
        <Box
          bgcolor={theme.palette.text.primary}
          borderRadius="2em"
          height={4}
          width={4}
        />
      </DivIconMarker>
    );
  } else if (locationStyle == 'households') {
    return (
      <DivIconMarker iconAnchor={[6, 22]} position={location.position}>
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
            fontSize="12px"
            justifyContent="center"
            paddingX="2px"
            width="100%"
          >
            {location.households.length}
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
    let visits = 0;
    let successfulVisits = 0;
    location.households.forEach((household) => {
      const visitInThisAssignment = household.visits.find(
        (visit) => visit.areaAssId == areaAssId
      );
      if (visitInThisAssignment) {
        visits++;

        const responseToMetricThatDefinesDone =
          visitInThisAssignment.responses.find(
            (response) => response.metricId == idOfMetricThatDefinesDone
          );

        if (responseToMetricThatDefinesDone?.response == 'yes') {
          successfulVisits++;
        }
      }
    });

    const successfulVisitsColorPercent =
      (successfulVisits / location.households.length) * 100;
    const visitsColorPercent = (visits / location.households.length) * 100;

    return (
      <DivIconMarker iconAnchor={[6, 24]} position={location.position}>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Box
            alignItems="center"
            bgcolor="white"
            borderRadius={1}
            boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
            color={theme.palette.text.secondary}
            display="inline-flex"
            flexDirection="column"
            fontSize="12px"
            justifyContent="center"
            padding="2px"
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
                height: '16px',
                justifyContent: 'center',
                width: '16px',
              }}
            />
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
  }
};

type OrganizerMapRendererProps = {
  areaAssId: string;
  areaStats: ZetkinAssignmentAreaStats;
  areaStyle: 'households' | 'progress' | 'hide' | 'assignees' | 'outlined';
  areas: ZetkinArea[];
  assignment: ZetkinAreaAssignment;
  locationStyle: 'dot' | 'households' | 'progress' | 'hide';
  locations: ZetkinLocation[];
  navigateToAreaId?: string;
  onSelectedIdChange: (newId: string) => void;
  overlayStyle: 'assignees' | 'households' | 'progress' | 'hide';
  selectedId: string;
  sessions: ZetkinAreaAssignmentSession[];
};

const OrganizerMapRenderer: FC<OrganizerMapRendererProps> = ({
  areas,
  areaStats,
  areaStyle,
  assignment,
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
        location.position,
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
      numberOfHouseholdsInArea += location.households.length;
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
              // by size, so that big ones are underneith and the
              // smaller ones can be clicked.
              const bounds0 = latLngBounds(a0.points.map(objToLatLng));
              const bounds1 = latLngBounds(a1.points.map(objToLatLng));

              const dimensions0 = {
                x: bounds0.getEast() - bounds0.getWest(),
                y: bounds0.getNorth() - bounds0.getSouth(),
              };
              const dimensions1 = {
                x: bounds1.getEast() - bounds1.getWest(),
                y: bounds1.getNorth() - bounds1.getSouth(),
              };

              const size0 = dimensions0.x * dimensions0.y;
              const size1 = dimensions1.x * dimensions1.y;

              return size1 - size0;
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

            const people = sessions
              .filter((session) => session.area.id == area.id)
              .map((session) => session.assignee);

            const hasPeople = !!people.length;

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
              (stat) => stat.areaId == area.id
            );

            let numberOfHouseholds = 0;
            locationsByAreaId[area.id].forEach(
              (location) => (numberOfHouseholds += location.households.length)
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
                  <DivIconMarker iconAnchor={[0, 0]} position={mid}>
                    <Box
                      bgcolor="white"
                      borderRadius={1}
                      boxShadow="0px 4px 20px 0px rgba(0,0,0,0.3)"
                      display="inline-flex"
                      flexDirection="column"
                      gap="2px"
                      padding="2px 6px"
                      sx={{ translate: '-50% -50%' }}
                    >
                      <Typography fontSize="11px">
                        {numberOfLocations}
                      </Typography>
                      <Divider />
                      <Typography fontSize="11px">
                        {numberOfHouseholds}
                      </Typography>
                    </Box>
                  </DivIconMarker>
                )}
                {overlayStyle == 'progress' && stats && (
                  <DivIconMarker iconAnchor={[0, 0]} position={mid}>
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
                          height: '20px',
                          justifyContent: 'center',
                          width: '20px',
                        }}
                      />
                    </Box>
                  </DivIconMarker>
                )}
                {overlayStyle == 'assignees' && hasPeople && (
                  <DivIconMarker iconAnchor={[0, 0]} position={mid}>
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
                        {people.map((person, index) => {
                          if (index <= 4) {
                            return (
                              <Box
                                //TODO: only use person id once we have logic preventing
                                //assigning the same person to an area more than once
                                key={`${person.id}-${index}`}
                                sx={{
                                  borderRadius: '50%',
                                  boxShadow: '0 0 8px rgba(0,0,0,0.3)',
                                }}
                              >
                                <ZUIAvatar
                                  size={zoom >= 16 ? 'sm' : 'xs'}
                                  url={`/api/orgs/${assignment.organization.id}/people/${person.id}/avatar`}
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
                                >{`+${people.length - 5}`}</Typography>
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
                        <Box>{people.length}</Box>
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
                      onSelectedIdChange(selected ? '' : area.id);
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
            const areaIds: string[] = [];
            areas.forEach((area) => {
              const isInsideArea = isPointInsidePolygon(
                location.position,
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
            let idOfAreaInThisAssignment = '';
            for (let i = 0; i < areaIds.length; i++) {
              const id = areaIds[i];
              const people = sessions
                .filter((session) => session.area.id == id)
                .map((session) => session.assignee);

              const hasPeople = !!people.length;

              if (hasPeople) {
                idOfAreaInThisAssignment = id;
                break;
              }
            }

            //Check if the location has housholds with visits in this assignment
            const hasVisitsInThisAssignment = location.households.some(
              (household) =>
                !!household.visits.find((visit) => visit.areaAssId == areaAssId)
            );

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
                idOfMetricThatDefinesDone={
                  assignment.metrics.find((metric) => metric.definesDone)?.id ||
                  ''
                }
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
