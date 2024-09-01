import { Box, useTheme } from '@mui/material';
import { FeatureGroup, Map } from 'leaflet';
import { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  FeatureGroup as FeatureGroupComponent,
  Polygon,
  Polyline,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

import { PointData, ZetkinArea } from 'features/areas/types';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';

type Props = {
  areas: ZetkinArea[];
  drawingPoints: PointData[] | null;
  mapRef: MutableRefObject<Map | null>;
  onChangeDrawingPoints: (points: PointData[]) => void;
  onFinishDrawing: () => void;
  onSelectArea: (area: ZetkinArea) => void;
  selectedId: string | null;
};

const MapRenderer: FC<Props> = ({
  areas,
  drawingPoints,
  mapRef,
  onChangeDrawingPoints,
  onFinishDrawing,
  onSelectArea,
  selectedId,
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
    mapRef.current = map;
  }, [map]);

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
        {areas
          .sort((a0, a1) => {
            // Always render selected last, so that it gets
            // rendered on top of the unselected ones in case
            // there are overlaps.
            if (a0.id == selectedId) {
              return 1;
            } else if (a1.id == selectedId) {
              return -1;
            }
            return 0;
          })
          .map((area) => {
            const selected = selectedId == area.id;

            // The key changes when selected, to force redraw of polygon
            // to reflect new state through visual style
            const key = area.id + (selected ? '-selected' : '-default');

            return (
              <Polygon
                key={key}
                color={
                  selected
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main
                }
                eventHandlers={{
                  click: () => {
                    onSelectArea(area);
                  },
                }}
                positions={area.points}
                weight={selected ? 5 : 2}
              />
            );
          })}
      </FeatureGroupComponent>
    </>
  );
};

export default MapRenderer;
