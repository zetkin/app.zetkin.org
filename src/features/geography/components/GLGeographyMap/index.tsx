import { Box } from '@mui/material';
import Map, { Layer, Source } from '@vis.gl/react-maplibre';
import { FC, useMemo, useState } from 'react';
import { LngLatBounds, LngLatLike, Map as MapType } from 'maplibre-gl';

import { Zetkin2Area } from 'features/areas/types';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import oldTheme from 'theme';
import AreaOverlay from 'features/areas/components/AreaOverlay';
import oldAreaFormat from 'features/areas/utils/oldAreaFormat';
import useAreaEditing from 'features/geography/hooks/useAreaEditing';
import useAreaSelection from 'features/geography/hooks/useAreaSelection';
import SelectedArea from './SelectedArea';

type Props = {
  areas: Zetkin2Area[];
};

const GLGeographyMap: FC<Props> = ({ areas }) => {
  const env = useEnv();
  const [map, setMap] = useState<MapType | null>(null);
  const { selectedArea, setSelectedId } = useAreaSelection({ areas, map });
  const { draggingPoints, editing, editingArea, setEditing } = useAreaEditing({
    map,
    selectedArea,
  });

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
  }, [areas, selectedArea]);

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
            area={
              editingArea
                ? oldAreaFormat(editingArea)
                : oldAreaFormat(selectedArea)
            }
            editing={editing}
            onBeginEdit={() => setEditing(true)}
            onCancelEdit={() => setEditing(false)}
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
          {!!selectedArea && (
            <SelectedArea
              draggingPoints={draggingPoints}
              editingArea={editingArea}
              selectedArea={selectedArea}
            />
          )}
        </Map>
      </Box>
    </AreaFilterProvider>
  );
};

export default GLGeographyMap;
