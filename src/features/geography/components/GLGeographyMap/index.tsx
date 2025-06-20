import area from '@turf/area';
import distance from '@turf/distance';
import { Box } from '@mui/material';
import Map, { Layer, Source } from '@vis.gl/react-maplibre';
import { FC, useEffect, useMemo, useState } from 'react';
import {
  LngLatBounds,
  LngLatLike,
  MapLayerMouseEvent,
  MapMouseEvent,
  Map as MapType,
} from 'maplibre-gl';

import { Zetkin2Area, Zetkin2AreaLine } from 'features/areas/types';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import oldTheme from 'theme';
import AreaOverlay from 'features/areas/components/AreaOverlay';
import lngLat from 'features/geography/utils/lngLat';
import oldAreaFormat from 'features/areas/utils/oldAreaFormat';

type Props = {
  areas: Zetkin2Area[];
};

const GLGeographyMap: FC<Props> = ({ areas }) => {
  const env = useEnv();
  const [map, setMap] = useState<MapType | null>(null);
  const [editingArea, setEditingArea] = useState<Zetkin2Area | null>(null);
  const [draggingPoints, setDraggingPoints] = useState<Zetkin2AreaLine | null>(
    null
  );
  const [selectedId, setSelectedId] = useState(0);

  const editing = !!editingArea;
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
  }, [areas, selectedArea]);

  const selectedAreaGeoJson: GeoJSON.GeoJSON | null = useMemo(() => {
    if (selectedArea && draggingPoints) {
      return {
        geometry: { coordinates: [draggingPoints], type: 'Polygon' },
        properties: { id: selectedArea.id },
        type: 'Feature',
      };
    } else if (selectedArea) {
      return {
        geometry: editing ? editingArea.boundary : selectedArea.boundary,
        properties: { id: selectedArea.id },
        type: 'Feature',
      };
    } else {
      return null;
    }
  }, [selectedArea, draggingPoints, editingArea]);

  useEffect(() => {
    if (map) {
      const handleClick = (ev: MapLayerMouseEvent) => {
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

      let draggedPointIndex: number | null = null;
      let updatedPoints: Zetkin2AreaLine | null = null;

      const handleDragStart = (ev: MapLayerMouseEvent) => {
        const line = editingArea?.boundary.coordinates[0];
        if (line) {
          const lineWithoutLast = line.slice(0, -1);
          const sortedCoords = lineWithoutLast
            .concat()
            .sort(
              (c0, c1) =>
                distance(c0, ev.lngLat.toArray()) -
                distance(c1, ev.lngLat.toArray())
            );
          const nearestCoord = sortedCoords[0];
          draggedPointIndex = lineWithoutLast.indexOf(nearestCoord);

          setDraggingPoints(line);
          map.on('mousemove', handleDragMove);
          map.on('mouseup', handleDragEnd);
          ev.preventDefault();
        } else {
          draggedPointIndex = null;
        }
      };

      const handleDragMove = (ev: MapMouseEvent) => {
        setDraggingPoints((current) => {
          if (current) {
            updatedPoints = current;
            const isDraggingFirst = draggedPointIndex == 0;
            return current.map((originalLngLat, index) => {
              const isDraggedPoint = index == draggedPointIndex;
              const isLastPoint = index == current.length - 1;
              const shouldReplace =
                isDraggedPoint || (isDraggingFirst && isLastPoint);

              return shouldReplace
                ? lngLat(ev.lngLat.toArray())
                : originalLngLat;
            });
          } else {
            return null;
          }
        });
      };

      const handleDragEnd = () => {
        map.off('mousemove', handleDragMove);
        map.off('mouseup', handleDragEnd);
        draggedPointIndex = null;

        if (editingArea && updatedPoints) {
          setDraggingPoints(null);
          setEditingArea({
            ...editingArea,
            boundary: {
              ...editingArea?.boundary,
              coordinates: [updatedPoints],
            },
          });
        }
      };

      setDraggingPoints(null);
      map.on('click', 'areas', handleClick);
      map.on('mousedown', 'editPoints', handleDragStart);

      return () => {
        map.off('click', 'areas', handleClick);
        map.off('mousedown', 'editPoints', handleDragStart);
        map.off('mousemove', handleDragMove);
        map.off('mouseup', handleDragEnd);
      };
    }
  }, [map, selectedArea, editingArea]);

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
            onBeginEdit={() => setEditingArea(selectedArea)}
            onCancelEdit={() => setEditingArea(null)}
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
              {!!editing && (
                <Layer
                  id="editPoints"
                  paint={{
                    'circle-color': oldTheme.palette.primary.main,
                    'circle-radius': 8,
                  }}
                  type="circle"
                />
              )}
            </Source>
          )}
        </Map>
      </Box>
    </AreaFilterProvider>
  );
};

export default GLGeographyMap;
