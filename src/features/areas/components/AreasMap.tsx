import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useRef, useState } from 'react';
import {
  FeatureGroup as FGComponent,
  MapContainer,
  Polygon,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { FeatureGroup, Map as MapType } from 'leaflet';
import { Box, Button, ButtonGroup } from '@mui/material';
import { Add, Close, Create, Remove, Save } from '@mui/icons-material';

import { PointData, ZetkinArea } from '../types';
import useCreateArea from '../hooks/useCreateArea';
import { useNumericRouteParams } from 'core/hooks';
import AreaOverlay from './AreaOverlay';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import { DivIconMarker } from 'features/events/components/LocationModal/DivIconMarker';

interface MapProps {
  areas: ZetkinArea[];
}

const MapWrapper = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

const Map: FC<MapProps> = ({ areas }) => {
  const mapRef = useRef<MapType | null>(null);
  const zoomedRef = useRef(false);
  const reactFGref = useRef<FeatureGroup | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<PointData[] | null>(null);
  const drawingRef = useRef(false);
  const [selectedId, setSelectedId] = useState('');

  const selectedArea = areas.find((area) => area.id == selectedId);

  const { orgId } = useNumericRouteParams();
  const createArea = useCreateArea(orgId);

  useEffect(() => {
    const ctr = mapRef.current?.getContainer();
    if (ctr) {
      ctr.style.cursor = drawingPoints ? 'crosshair' : '';
    }
  }, [drawingPoints]);

  useEffect(() => {
    if (!zoomedRef.current) {
      const bounds = reactFGref.current?.getBounds();
      if (bounds) {
        mapRef.current?.fitBounds(bounds);
      }
    }
  }, [areas]);

  function finishDrawing() {
    if (drawingPoints && drawingPoints.length > 2) {
      createArea({ points: drawingPoints });
    }
    setDrawingPoints(null);
    drawingRef.current = false;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        display="flex"
        gap={1}
        sx={{
          left: '1rem',
          position: 'absolute',
          top: '1rem',
          zIndex: 9999,
        }}
      >
        <ButtonGroup variant="contained">
          <Button onClick={() => mapRef.current?.zoomIn()}>
            <Add />
          </Button>
          <Button onClick={() => mapRef.current?.zoomOut()}>
            <Remove />
          </Button>
        </ButtonGroup>

        <ButtonGroup variant="contained">
          {!drawingPoints && (
            <Button
              onClick={() => {
                setDrawingPoints([]);
                drawingRef.current = true;
              }}
              startIcon={<Create />}
            >
              <Msg id={messageIds.tools.draw} />
            </Button>
          )}
          {drawingPoints && (
            <Button
              onClick={() => {
                setDrawingPoints(null);
                drawingRef.current = false;
              }}
              startIcon={<Close />}
            >
              <Msg id={messageIds.tools.cancel} />
            </Button>
          )}
          {drawingPoints && drawingPoints.length > 2 && (
            <Button
              onClick={() => {
                finishDrawing();
              }}
              startIcon={<Save />}
            >
              <Msg id={messageIds.tools.save} />
            </Button>
          )}
        </ButtonGroup>
      </Box>

      <Box flexGrow={1} position="relative">
        {selectedArea && (
          <AreaOverlay area={selectedArea} onClose={() => setSelectedId('')} />
        )}
        <MapContainer
          center={[0, 0]}
          style={{ height: '100%', width: '100%' }}
          zoom={2}
          zoomControl={false}
        >
          <MapWrapper>
            {(map) => {
              mapRef.current = map;
              if (!map.hasEventListeners('click')) {
                map.on('click', (evt) => {
                  if (drawingRef.current) {
                    const lat = evt.latlng.lat;
                    const lng = evt.latlng.lng;
                    setDrawingPoints((current) => [
                      ...(current || []),
                      [lat, lng],
                    ]);
                  }
                });

                map.on('zoom', () => {
                  zoomedRef.current = true;
                });
              }

              return (
                <>
                  <TileLayer
                    attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FGComponent
                    ref={(fgRef) => {
                      reactFGref.current = fgRef;
                    }}
                  >
                    {drawingPoints && (
                      <Polyline
                        pathOptions={{ color: 'red' }}
                        positions={drawingPoints}
                      />
                    )}
                    {drawingPoints && drawingPoints.length > 0 && (
                      <DivIconMarker position={drawingPoints[0]}>
                        <Box
                          onClick={(ev) => {
                            ev.stopPropagation();
                            finishDrawing();
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
                    {areas.map((polygon) => (
                      <Polygon
                        key={polygon.id}
                        eventHandlers={{
                          click: () => {
                            setSelectedId(polygon.id);
                          },
                        }}
                        positions={polygon.points}
                      />
                    ))}
                  </FGComponent>
                </>
              );
            }}
          </MapWrapper>
        </MapContainer>
      </Box>
    </Box>
  );
};

export default Map;
