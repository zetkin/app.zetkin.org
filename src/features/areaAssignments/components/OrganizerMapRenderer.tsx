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
  ZetkinAreaAssignment,
} from '../types';
import { getBoundSize } from '../../canvass/utils/getBoundSize';
import { useEnv } from 'core/hooks';
import MarkerIcon from 'features/canvass/components/MarkerIcon';
import locToLatLng from 'features/geography/utils/locToLatLng';
import oldTheme from 'theme';
import flipForLeaflet from 'features/areas/utils/flipForLeaflet';
import useLocations from '../hooks/useLocations';

const LocationMarker: FC<{
  location: ZetkinLocation;
  locationStyle: 'dot' | 'households' | 'progress';
}> = ({ location, locationStyle }) => {
  if (locationStyle == 'dot') {
    return (
      <DivIconMarker
        iconAnchor={[2, 2]}
        position={locToLatLng(location)}
        zIndexOffset={-1000}
      >
        <Box
          bgcolor={oldTheme.palette.text.primary}
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
            color={oldTheme.palette.text.secondary}
            display="inline-flex"
            flexDirection="column"
            fontSize="14px"
            justifyContent="center"
            paddingX="10px"
            width="100%"
          >
            {location.num_known_households || location.num_estimated_households}
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
    return (
      <DivIconMarker iconAnchor={[6, 24]} position={locToLatLng(location)}>
        <MarkerIcon
          selected={false}
          successfulVisits={
            location.num_households_successful || location.num_successful_visits
          }
          totalHouseholds={Math.max(
            location.num_estimated_households,
            location.num_known_households
          )}
          totalVisits={location.num_households_visited || location.num_visits}
          uniqueKey={location.id.toString()}
        />
      </DivIconMarker>
    );
  }
};

type OrganizerMapRendererProps = {
  areaStats: ZetkinAssignmentAreaStats;
  areaStyle: 'households' | 'progress' | 'hide' | 'assignees' | 'outlined';
  areas: ZetkinArea[];
  assignment: ZetkinAreaAssignment;
  locationStyle: 'dot' | 'households' | 'progress' | 'hide';
  locations: ZetkinLocation[];
  navigateToAreaId?: number;
  onSelectedIdChange: (newId: number) => void;
  overlayStyle: 'assignees' | 'households' | 'progress' | 'hide';
  selectedId: number;
  sessions: ZetkinAreaAssignee[];
};

function HouseholdOverlayMarker({
  area,
  assignment,
}: {
  area: ZetkinArea;
  assignment: ZetkinAreaAssignment;
}) {
  const locationsInArea =
    useLocations(assignment.organization_id, assignment.id, area.id).data ?? [];

  const totalHouseholds = locationsInArea.reduce(
    (sum, loc) =>
      sum + (loc.num_known_households || loc.num_estimated_households || 0),
    0
  );

  return (
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
      <Typography alignItems="center" display="flex" fontSize="14px">
        <DoorFront
          fontSize="small"
          sx={{ color: oldTheme.palette.grey[300] }}
        />
        {totalHouseholds}
      </Typography>
      <Divider
        sx={{
          width: '100%',
        }}
      />
      <Typography alignItems="center" display="flex" fontSize="14px">
        <Place fontSize="small" sx={{ color: oldTheme.palette.grey[300] }} />
        {locationsInArea.length}
      </Typography>
    </Box>
  );
}

function ProgressOverlayMarker({
  area,
  assignment,
}: {
  area: ZetkinArea;
  assignment: ZetkinAreaAssignment;
}) {
  const locationsInArea =
    useLocations(assignment.organization_id, assignment.id, area.id).data ?? [];

  const totalVisits = locationsInArea.reduce(
    (sum, location) => sum + (location.num_visits || 0),
    0
  );

  const totalSuccessfulVisits = locationsInArea.reduce(
    (sum, location) => sum + (location.num_successful_visits || 0),
    0
  );

  return (
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
            oldTheme.palette.primary.main
          } ${totalSuccessfulVisits}%, ${lighten(
            oldTheme.palette.primary.main,
            0.7
          )} ${totalSuccessfulVisits}% ${totalVisits}%, ${
            oldTheme.palette.grey[400]
          } ${totalVisits}%)`,
          borderRadius: '2em',
          display: 'flex',
          flexDirection: 'row',
          height: '30px',
          justifyContent: 'center',
          width: '30px',
        }}
      />
    </Box>
  );
}

function NumberOverlayMarker(props: { value: number }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: oldTheme.palette.primary.main,
        borderRadius: 10,
        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        color: oldTheme.palette.primary.contrastText,
        display: 'flex',
        fontWeight: 'bold',
        height: 30,
        justifyContent: 'center',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        width: 30,
      }}
    >
      <Box>{props.value}</Box>
    </Box>
  );
}

function AssigneeOverlayMarker({
  userIds,
  zoom,
}: {
  userIds: number[];
  zoom: number;
}) {
  return (
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
              //TODO: only use person id once we have logic preventing
              //assigning the same person to an area more than once
              key={`${userId}-${index}`}
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
  );
}

const OrganizerMapRenderer: FC<OrganizerMapRendererProps> = ({
  areas,
  areaStats,
  areaStyle,
  assignment,
  locations,
  selectedId,
  sessions,
  navigateToAreaId,
  onSelectedIdChange,
  overlayStyle,
  locationStyle,
}) => {
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
          map.fitBounds(areaToNavigate.points.map(flipForLeaflet));
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

  const env = useEnv();
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
        ? oldTheme.palette.primary.main
        : oldTheme.palette.secondary.main;
    }

    if (areaStyle == 'progress' && !hasPeople) {
      return oldTheme.palette.secondary.main;
    }

    return areaStyle == 'households'
      ? //TODO: Use theme colors for these
        `color-mix(in hsl, ${lighten(oldTheme.palette.primary.main, 0.8)}, ${
          oldTheme.palette.primary.main
        } ${householdColorPercent}%)`
      : `color-mix(in hsl,  ${lighten(oldTheme.palette.primary.main, 0.8)}, ${
          oldTheme.palette.primary.main
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
        location.num_known_households || location.num_estimated_households;
    });

    if (numberOfHouseholdsInArea > highestHousholds) {
      highestHousholds = numberOfHouseholdsInArea;
    }
  });

  const filteredAreas = areas
    .map((area) => {
      const people = sessions
        .filter((session) => session.area_id == area.id)
        .map((session) => session.user_id);
      const hasPeople = !!people.length;
      return { ...area, hasPeople };
    })
    .filter((area) => {
      // Right now there is only one kind of filter
      if (assigneesFilter === null) {
        return true;
      }

      if (area.hasPeople && assigneesFilter == 'unassigned') {
        return false;
      } else if (!area.hasPeople && assigneesFilter == 'assigned') {
        return false;
      }
      return true;
    });

  return (
    <>
      <AttributionControl position="bottomright" prefix={false} />
      <TileLayer
        attribution="<span style='color:#a3a3a3;'>Leaflet & OpenStreetMap</span>"
        url={env.vars.TILESERVER + '/{z}/{x}/{y}.png'}
      />
      <FeatureGroup
        ref={(fgRef) => {
          reactFGref.current = fgRef;
        }}
      >
        {filteredAreas
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
          .map((area, index) => {
            const selected = selectedId == area.id;

            // The key changes when selected, to force redraw of polygon
            // to reflect new state through visual style. Since we also
            // care about keeping the order form above, we include that in the
            // key as well.
            const key = [
              area.id,
              selected ? 'selected' : 'default',
              areaStyle,
              area.hasPeople ? 'assigned' : 'unassigned',
              index,
            ].join('-');

            const stats = areaStats.stats.find(
              (stat) => stat.area_id == area.id
            );

            let numberOfHouseholds = 0;
            locationsByAreaId[area.id].forEach(
              (location) =>
                (numberOfHouseholds +=
                  location.num_known_households ||
                  location.num_estimated_households)
            );
            const householdColorPercent =
              (numberOfHouseholds / highestHousholds) * 100;

            const visitsColorPercent = stats?.num_households
              ? (stats.num_visited_households / stats.num_households) * 100
              : 0;

            return (
              <Polygon
                key={key}
                color={areaStyle == 'hide' ? '' : 'black'}
                dashArray={!area.hasPeople ? '5px 7px' : ''}
                eventHandlers={{
                  click: () => {
                    onSelectedIdChange(selected ? 0 : area.id);
                  },
                }}
                fillColor={getAreaColor(
                  area.hasPeople,
                  householdColorPercent,
                  visitsColorPercent
                )}
                fillOpacity={1}
                interactive={areaStyle != 'hide'}
                positions={area.points.map(flipForLeaflet)}
                weight={selected ? 5 : 2}
              />
            );
          })}
      </FeatureGroup>
      {locationStyle != 'hide' && (
        <FeatureGroup>
          {locations.map((location) => {
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
                location={location}
                locationStyle={locationStyle}
              />
            );
          })}
        </FeatureGroup>
      )}
      <FeatureGroup>
        {filteredAreas.map((area) => {
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
                mid[0] += point[1];
                mid[1] += point[0];
              });

            mid[0] /= area.points.length;
            mid[1] /= area.points.length;
          }

          const detailed = zoom >= 15;

          const userIds = sessions
            .filter((session) => session.area_id == area.id)
            .map((session) => session.user_id);

          const markerToRender = () => {
            if (overlayStyle === 'households') {
              return (
                <HouseholdOverlayMarker area={area} assignment={assignment} />
              );
            }
            if (overlayStyle == 'progress') {
              return (
                <ProgressOverlayMarker area={area} assignment={assignment} />
              );
            }
            if (overlayStyle === 'assignees' && area.hasPeople) {
              if (detailed) {
                return <AssigneeOverlayMarker userIds={userIds} zoom={zoom} />;
              }
              return <NumberOverlayMarker value={userIds.length} />;
            }
            return null;
          };

          const marker = markerToRender();
          if (marker === null) {
            return null;
          }
          return (
            <DivIconMarker
              key={area.id}
              iconAnchor={[0, 0]}
              position={mid}
              zIndexOffset={100}
            >
              {marker}
            </DivIconMarker>
          );
        })}
      </FeatureGroup>
    </>
  );
};

export default OrganizerMapRenderer;
