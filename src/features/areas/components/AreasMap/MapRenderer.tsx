import { Box, useTheme } from '@mui/material';
import { FeatureGroup, latLngBounds } from 'leaflet';
import { FC, useEffect, useRef, useState } from 'react';
import {
  FeatureGroup as FeatureGroupComponent,
  Polygon,
  Polyline,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

import { PointData, ZetkinArea } from 'features/areas/types';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';
import objToLatLng from 'features/areas/utils/objToLatLng';

type Props = {
  areas: ZetkinArea[];
  drawingPoints: PointData[] | null;
  editingArea: ZetkinArea | null;
  onChangeArea: (area: ZetkinArea) => void;
  onChangeDrawingPoints: (points: PointData[]) => void;
  onFinishDrawing: () => void;
  onSelectArea: (area: ZetkinArea | null) => void;
  selectedArea: ZetkinArea | null;
};

const MapRenderer: FC<Props> = ({
  areas,
  drawingPoints,
  editingArea,
  onChangeArea,
  onChangeDrawingPoints,
  onFinishDrawing,
  onSelectArea,
  selectedArea,
}) => {
  const [zoomed, setZoomed] = useState(false);
  const reactFGref = useRef<FeatureGroup | null>(null);
  const theme = useTheme();

  const map = useMapEvents({
    click: (evt) => {
      if (isDrawing) {
        const lat = evt.latlng.lat;
        const lng = evt.latlng.lng;
        const current = drawingPoints || [];
        onChangeDrawingPoints([...current, [lat, lng]]);
      }
    },
    zoom: () => {
      setZoomed(true);
    },
  });

  const isDrawing = !!drawingPoints;

  useEffect(() => {
    const ctr = map.getContainer();
    if (ctr) {
      ctr.style.cursor = drawingPoints ? 'crosshair' : '';
    }
  }, [drawingPoints]);

  useEffect(() => {
    if (map && !zoomed) {
      const bounds = reactFGref.current?.getBounds();
      if (bounds?.isValid()) {
        map.fitBounds(bounds);
        setZoomed(true);
      }
    }
  }, [areas, map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroupComponent
        ref={(fgRef) => {
          reactFGref.current = fgRef;
        }}
      >
        {drawingPoints && (
          <Polyline pathOptions={{ color: 'red' }} positions={drawingPoints} />
        )}
        {drawingPoints && drawingPoints.length > 0 && (
          <DivIconMarker position={drawingPoints[0]}>
            <Box
              onClick={(ev) => {
                ev.stopPropagation();
                onFinishDrawing();
              }}
              sx={{
                backgroundColor: 'red',
                borderRadius: '10px',
                height: 20,
                transform: 'translate(-25%, -25%)',
                width: 20,
              }}
            />
          </DivIconMarker>
        )}
        {!!editingArea && (
          <Polygon
            key={'editing'}
            color={theme.palette.primary.main}
            positions={editingArea.points}
            weight={5}
          />
        )}
        {editingArea?.points?.map((point, index) => {
          return (
            <DivIconMarker
              key={index}
              draggable
              eventHandlers={{
                dragend: (evt) => {
                  onChangeArea({
                    ...editingArea,
                    points: editingArea.points.map((oldPoint, oldIndex) =>
                      oldIndex == index ? evt.target.getLatLng() : oldPoint
                    ),
                  });
                },
              }}
              position={point}
            >
              <Box
                sx={{
                  bgcolor: theme.palette.primary.main,
                  height: 14,
                  width: 14,
                }}
              />
            </DivIconMarker>
          );
        })}
        {areas
          .filter(
            (area) => area.id != editingArea?.id && area.id != selectedArea?.id
          )
          .sort((a0, a1) => {
            // Sort areas by size, so that big ones are underneith and the
            // smaller ones can more easily be clicked.
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
          })
          .map((area) => {
            // The key changes when selected, to force redraw of polygon
            // to reflect new state through visual style
            const key = area.id + '-default';

            return (
              <Polygon
                key={key}
                color={theme.palette.secondary.main}
                eventHandlers={{
                  click: () => {
                    if (!isDrawing) {
                      onSelectArea(area);
                    }
                  },
                }}
                positions={area.points}
                weight={2}
              />
            );
          })}
        {selectedArea && (
          <Polygon
            key={`${selectedArea.id}-selected`}
            color={theme.palette.primary.main}
            eventHandlers={{
              click: () => {
                onSelectArea(null);
              },
            }}
            positions={selectedArea.points}
            weight={5}
          />
        )}
      </FeatureGroupComponent>
    </>
  );
};

export default MapRenderer;
