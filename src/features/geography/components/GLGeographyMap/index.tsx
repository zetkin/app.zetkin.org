import area from '@turf/area';
import { Box } from '@mui/material';
import Map, { Layer, Source } from '@vis.gl/react-maplibre';
import { FC, useEffect, useMemo, useState } from 'react';
import {
  LngLatBounds,
  LngLatLike,
  MapLayerMouseEvent,
  Map as MapType,
} from 'maplibre-gl';

import { Zetkin2Area } from 'features/areas/types';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import oldTheme from 'theme';
import AreaOverlay from 'features/areas/components/AreaOverlay';

type Props = {
  areas: Zetkin2Area[];
};

const GLGeographyMap: FC<Props> = ({ areas }) => {
  const env = useEnv();
  const [map, setMap] = useState<MapType | null>(null);
  const [selectedId, setSelectedId] = useState(0);

  const selectedArea = areas.find((area) => area.id == selectedId) || null;

  const bounds: [LngLatLike, LngLatLike] = useMemo(() => {
    const firstPolygon = areas[0]?.boundary.coordinates[0];
    if (firstPolygon?.length) {
      const totalBounds = new LngLatBounds(firstPolygon[0], firstPolygon[0]);

      // Extend with all areas
      areas.forEach((area) => {
        area.boundary.coordinates[0]?.forEach((lngLat) =>
          totalBounds.extend(lngLat)
        );
      });

      return [totalBounds.getSouthWest(), totalBounds.getNorthEast()];
    }

    const min: LngLatLike = [180, 90];
    const max: LngLatLike = [-180, -90];

    return [min, max];
  }, [areas]);

  const areasGeoJson: GeoJSON.GeoJSON = useMemo(() => {
    return {
      features: areas
        .filter((area) => area.id != selectedArea?.id)
        .map((area) => ({
          geometry: area.boundary,
          properties: { id: area.id },
          type: 'Feature',
        })),
      type: 'FeatureCollection',
    };
  }, [areas]);

  const selectedAreaGeoJson: GeoJSON.GeoJSON | null = useMemo(() => {
    return selectedArea
      ? {
          geometry: selectedArea.boundary,
          properties: { id: selectedArea.id },
          type: 'Feature',
        }
      : null;
  }, [selectedArea]);

  useEffect(() => {
    if (map) {
      const handle = (ev: MapLayerMouseEvent) => {
        if (ev.features) {
          const sortedFeatures =
            ev.features.length > 1
              ? ev.features.sort((f0, f1) => area(f0) - area(f1))
              : ev.features;

          const firstFeature = sortedFeatures[0];

          if (firstFeature) {
            setSelectedId(firstFeature.properties.id);
          }
        }
      };

      map.on('click', 'areas', handle);

      return () => {
        map.off('click', 'areas', handle);
      };
    }
  }, [map]);

  return (
    <AreaFilterProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <ZUIMapControls
          onFitBounds={() => {
            if (map) {
              const firstPolygon = areas[0]?.boundary.coordinates[0];
              if (firstPolygon.length) {
                const totalBounds = new LngLatBounds(
                  firstPolygon[0],
                  firstPolygon[0]
                );

                // Extend with all areas
                areas.forEach((area) => {
                  area.boundary.coordinates[0]?.forEach((lngLat) =>
                    totalBounds.extend(lngLat)
                  );
                });

                if (totalBounds) {
                  map.fitBounds(totalBounds, { animate: true, duration: 800 });
                }
              }
            }
          }}
          onGeolocate={(lngLat) => {
            map?.panTo(lngLat, { animate: true, duration: 800 });
          }}
          onZoomIn={() => map?.zoomIn()}
          onZoomOut={() => map?.zoomOut()}
        />
        {selectedArea && (
          <AreaOverlay
            area={{
              // TODO: Switch to Zetkin2Area
              description: selectedArea.description,
              id: selectedArea.id,
              organization_id: selectedArea.organization_id,
              points: selectedArea.boundary.coordinates[0],
              tags: [],
              title: selectedArea.title,
            }}
            editing={false}
            onBeginEdit={() => {}}
            onCancelEdit={() => {}}
            onClose={() => setSelectedId(0)}
          />
        )}
        <Map
          ref={(map) => setMap(map?.getMap() ?? null)}
          initialViewState={{ bounds }}
          mapStyle={env.vars.MAPLIBRE_STYLE}
          onClick={(ev) => {
            ev.target.panTo(ev.lngLat, { animate: true });
          }}
          style={{ height: '100%', width: '100%' }}
        >
          <Source data={areasGeoJson} id="areas" type="geojson">
            <Layer
              id="outlines"
              paint={{
                'line-color': oldTheme.palette.primary.main,
                'line-width': 2,
              }}
              type="line"
            />
            <Layer
              id="areas"
              paint={{
                'fill-color': oldTheme.palette.primary.main,
                'fill-opacity': 0.4,
              }}
              type="fill"
            />
          </Source>
          {!!selectedAreaGeoJson && (
            <Source data={selectedAreaGeoJson} type="geojson">
              <Layer
                id="selectedOutlines"
                paint={{
                  'line-color': oldTheme.palette.primary.main,
                  'line-width': 3,
                }}
                type="line"
              />
              <Layer
                id="selectedArea"
                paint={{
                  'fill-color': oldTheme.palette.primary.main,
                  'fill-opacity': 0.6,
                }}
                type="fill"
              />
            </Source>
          )}
        </Map>
      </Box>
    </AreaFilterProvider>
  );
};

export default GLGeographyMap;
