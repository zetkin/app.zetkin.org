import { Box, useTheme } from '@mui/material';
import { FeatureGroup } from 'leaflet';
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
import { getBoundSize } from '../../../canvass/utils/getBoundSize';

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
                  const latLng = evt.target.getLatLng();
                  const movedPoint: PointData = [latLng.lat, latLng.lng];
                  onChangeArea({
                    ...editingArea,
                    points: editingArea.points.map((oldPoint, oldIndex) =>
                      oldIndex == index ? movedPoint : oldPoint
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
          // Sort areas by size, so that big ones are underneath and the
          // smaller ones can more easily be clicked.
          .map((area) => ({ area, size: getBoundSize(area) }))
          .sort((a0, a1) => {
            return a1.size - a0.size;
          })
          .map(({ area }, index) => {
            // The key changes when selected, to force redraw of polygon
            // to reflect new state through visual style. Since we also
            // care about keeping the order form above, we include that in the
            // key as well.
            const key = `${area.id}-${index}-default`;

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
        {selectedArea && !editingArea && (
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
