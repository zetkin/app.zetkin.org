import { FC, useContext, useEffect, useRef, useState } from 'react';
import {
  AttributionControl,
  FeatureGroup,
  Polygon,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { FeatureGroup as FeatureGroupType, latLngBounds } from 'leaflet';
import { useTheme } from '@mui/styles';
import { Box } from '@mui/material';

import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import ZUIAvatar from 'zui/ZUIAvatar';
import {
  ZetkinAssignmentAreaStats,
  ZetkinCanvassSession,
  ZetkinPlace,
} from '../types';
import { ZetkinArea } from 'features/areas/types';
import objToLatLng from 'features/areas/utils/objToLatLng';
import { assigneesFilterContext } from './PlanMapFilters/AssigneeFilterContext';

const PlaceMarker: FC<{
  canvassAssId: string;
  largestNumberOfHouseholds: number;
  place: ZetkinPlace;
  placeStyle: 'dot' | 'households' | 'progress';
}> = ({ canvassAssId, largestNumberOfHouseholds, place, placeStyle }) => {
  if (placeStyle == 'dot') {
    return (
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.text.primary,
          borderRadius: '2em',
          height: 5,
          width: 5,
        })}
      />
    );
  } else if (placeStyle == 'households') {
    const householdColorPercent =
      (place.households.length / largestNumberOfHouseholds) * 100;
    return (
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: `color-mix(in hsl, #A0C6F0, #9D46E6 ${householdColorPercent}%)`,
          borderRadius: '2em',
          color: 'white',
          display: 'flex',
          flexDirection: 'row',
          height: '20px',
          justifyContent: 'center',
          width: '20px',
        }}
      >
        {place.households.length}
      </Box>
    );
  } else {
    //placeStyle is 'progress'
    let visits = 0;
    place.households.forEach((household) => {
      const visitInThisAssignment = household.visits.find(
        (visit) => visit.canvassAssId == canvassAssId
      );
      if (visitInThisAssignment) {
        visits++;
      }
    });

    const visitsColorPercent = (visits / place.households.length) * 100;

    return (
      <div
        style={{
          alignItems: 'center',
          backgroundColor: `color-mix(in hsl, #F1A8A8, #DC2626 ${visitsColorPercent}%)`,
          borderRadius: '2em',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '30px',
        }}
      >{`${visits}/${place.households.length}`}</div>
    );
  }
};

type PlanMapRendererProps = {
  areaStats: ZetkinAssignmentAreaStats;
  areaStyle: 'households' | 'progress' | 'hide' | 'default';
  areas: ZetkinArea[];
  canvassAssId: string;
  onSelectedIdChange: (newId: string) => void;
  overlayStyle: 'assignees' | 'households' | 'progress' | 'hide';
  placeStyle: 'dot' | 'households' | 'progress' | 'hide';
  places: ZetkinPlace[];
  selectedId: string;
  sessions: ZetkinCanvassSession[];
};

const PlanMapRenderer: FC<PlanMapRendererProps> = ({
  areas,
  areaStats,
  areaStyle,
  canvassAssId,
  selectedId,
  sessions,
  onSelectedIdChange,
  overlayStyle,
  placeStyle,
  places,
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

  useEffect(() => {
    if (map && !zoomed) {
      const bounds = reactFGref.current?.getBounds();
      if (bounds?.isValid()) {
        map.fitBounds(bounds);
        setZoomed(true);
      }
    }
  }, [areas, map]);

  const { assigneesFilter } = useContext(assigneesFilterContext);

  const largestNumberOfHouseholds = Math.max(
    ...places.map((place) => place.households.length)
  );

  const getAreaBackgroundColor = (
    hasPeople: boolean,
    householdColorPercent: number,
    visitsColorPercent: number
  ) => {
    if (areaStyle == 'default') {
      return hasPeople
        ? theme.palette.primary.main
        : theme.palette.secondary.main;
    }

    if (!hasPeople) {
      return 'grey';
    }

    return areaStyle == 'households'
      ? //TODO: Use theme colors for these
        `color-mix(in hsl, #A0C6F0, #9D46E6 ${householdColorPercent}%)`
      : `color-mix(in hsl, #F1A8A8, #DC2626 ${visitsColorPercent}%)`;
  };

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

            let highestHousholds = 0;
            areaStats.stats.forEach((stat) => {
              if (stat.num_households > highestHousholds) {
                highestHousholds = stat.num_households;
              }
            });

            const householdColorPercent = stats
              ? (stats.num_households / highestHousholds) * 100
              : 0;

            const visitsColorPercent = stats
              ? (stats.num_visits / stats.num_households) * 100
              : 0;

            return (
              <>
                {overlayStyle == 'households' && stats && (
                  <DivIconMarker iconAnchor={[11, 11]} position={mid}>
                    <div
                      style={{
                        alignItems: 'center',
                        backgroundColor: `color-mix(in hsl, #A0C6F0, #9D46E6 ${householdColorPercent}%)`,
                        border: '2px solid white',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'row',
                        height: '21px',
                        justifyContent: 'center',
                        padding: '0.75rem',
                        width: '21px',
                      }}
                    >
                      {stats.num_households}
                    </div>
                  </DivIconMarker>
                )}
                {overlayStyle == 'progress' && stats && (
                  <DivIconMarker iconAnchor={[20, 10]} position={mid}>
                    <div
                      style={{
                        alignItems: 'center',
                        backgroundColor: `color-mix(in hsl, #F1A8A8, #DC2626 ${visitsColorPercent}%)`,
                        borderRadius: '2rem',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'row',
                        height: '20px',
                        justifyContent: 'center',
                        width: '40px',
                      }}
                    >
                      {`${stats.num_visits}/${stats.num_households}`}
                    </div>
                  </DivIconMarker>
                )}
                {overlayStyle == 'assignees' && hasPeople && (
                  <DivIconMarker position={mid}>
                    {detailed && (
                      <Box display="flex" sx={{ pointerEvents: 'none' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '1px',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {people.map((person, index) => (
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
                                url={`/api/orgs/1/people/${person.id}/avatar`}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                    {overlayStyle == 'assignees' && !detailed && (
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
                {areaStyle != 'hide' && (
                  <Polygon
                    key={key}
                    color={getAreaBackgroundColor(
                      hasPeople,
                      householdColorPercent,
                      visitsColorPercent
                    )}
                    eventHandlers={{
                      click: () => {
                        onSelectedIdChange(selected ? '' : area.id);
                      },
                    }}
                    positions={area.points}
                    weight={selected ? 5 : 2}
                  />
                )}
              </>
            );
          })}
      </FeatureGroup>
      {placeStyle != 'hide' &&
        places.map((place) => (
          <DivIconMarker
            key={place.id}
            position={{
              lat: place.position.lat,
              lng: place.position.lng,
            }}
          >
            <PlaceMarker
              canvassAssId={canvassAssId}
              largestNumberOfHouseholds={largestNumberOfHouseholds}
              place={place}
              placeStyle={placeStyle}
            />
          </DivIconMarker>
        ))}
    </>
  );
};

export default PlanMapRenderer;
