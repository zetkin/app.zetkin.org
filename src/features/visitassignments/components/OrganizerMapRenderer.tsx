import { DoorFront, Place } from '@mui/icons-material';
import {
  AttributionControl,
  FeatureGroup,
  Polygon,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { Box, Divider, lighten, Typography } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { FeatureGroup as FeatureGroupType } from 'leaflet';

import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import isPointInsidePolygon from 'features/canvass/utils/isPointInsidePolygon';
import { ZetkinArea } from 'features/areas/types';
import { getBoundSize } from 'features/canvass/utils/getBoundSize';
import { useEnv } from 'core/hooks';
import oldTheme from 'theme';
import flipForLeaflet from 'features/areas/utils/flipForLeaflet';
import { ZetkinLngLatFieldValue, ZetkinPerson } from 'utils/types/zetkin';

const LocationMarker: FC<{
  person: ZetkinPerson;
}> = ({ person }) => {
  const location = person.home_location as ZetkinLngLatFieldValue;

  if (!location) {
    return null;
  } else {
    return (
      <DivIconMarker
        iconAnchor={[2, 2]}
        position={[location.lat, location.lng]}
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
  }
};

type OrganizerMapRendererProps = {
  areaStyle: 'households' | 'progress' | 'hide' | 'assignees' | 'outlined';
  areas: ZetkinArea[];
  locationStyle: 'dot' | 'households' | 'progress' | 'hide';
  navigateToAreaId?: number;
  onSelectedIdChange: (newId: number) => void;
  overlayStyle: 'assignees' | 'households' | 'progress' | 'hide';
  selectedId: number;
  targets: ZetkinPerson[];
};

function HouseholdOverlayMarker(props: {
  numberOfHouseholds: number;
  numberOfLocations: number;
}) {
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
        {props.numberOfHouseholds}
      </Typography>
      <Divider
        sx={{
          width: '100%',
        }}
      />
      <Typography alignItems="center" display="flex" fontSize="14px">
        <Place fontSize="small" sx={{ color: oldTheme.palette.grey[300] }} />

        {props.numberOfLocations}
      </Typography>
    </Box>
  );
}

const OrganizerMapRenderer: FC<OrganizerMapRendererProps> = ({
  areas,
  areaStyle,
  selectedId,
  navigateToAreaId,
  onSelectedIdChange,
  locationStyle,
  targets,
}) => {
  const reactFGref = useRef<FeatureGroupType | null>(null);

  const [zoomed, setZoomed] = useState(false);

  const map = useMapEvents({
    zoom: () => {
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

  const targetsByAreaId: Record<string, ZetkinPerson[]> = {};
  areas.forEach((area) => {
    targetsByAreaId[area.id] = [];

    targets.forEach((target) => {
      const isInsideArea = isPointInsidePolygon(
        target.home_location as ZetkinLngLatFieldValue,
        area.points.map((point) => ({
          lat: point[1],
          lng: point[0],
        }))
      );
      if (isInsideArea) {
        targetsByAreaId[area.id].push(target);
      }
    });
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
              index,
            ].join('-');

            const householdColorPercent = 100;

            return (
              <Polygon
                key={key}
                color={areaStyle == 'hide' ? '' : 'black'}
                eventHandlers={{
                  click: () => {
                    onSelectedIdChange(selected ? 0 : area.id);
                  },
                }}
                fillColor={getAreaColor(false, householdColorPercent, 100)}
                fillOpacity={1}
                interactive={areaStyle != 'hide'}
                positions={area.points.map(flipForLeaflet)}
                weight={selected ? 5 : 2}
              />
            );
          })}
      </FeatureGroup>
      <FeatureGroup>
        {targets.map((target) => {
          //Find ids of area/s that the location is in
          const areaIds: number[] = [];
          areas.forEach((area) => {
            const isInsideArea = isPointInsidePolygon(
              target.home_location as ZetkinLngLatFieldValue,
              area.points.map((point) => ({
                lat: point[1],
                lng: point[0],
              }))
            );

            if (isInsideArea) {
              areaIds.push(area.id);
            }
          });

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
            locationStyle == 'progress' && !hasVisitsInThisAssignment;

          if (hideFromProgressView) {
            return null;
          }

          return <LocationMarker key={target.id} person={target} />;
        })}
      </FeatureGroup>
      <FeatureGroup>
        {areas.map((area) => {
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

          const markerToRender = () => {
            return (
              <HouseholdOverlayMarker
                numberOfHouseholds={1}
                numberOfLocations={1}
              />
            );
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
