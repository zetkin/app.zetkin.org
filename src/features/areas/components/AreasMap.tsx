import 'leaflet/dist/leaflet.css';
import { FC, useRef, useState } from 'react';
import {
  FeatureGroup as FGComponent,
  MapContainer,
  Polygon,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { FeatureGroup, latLngBounds, Map as MapType } from 'leaflet';
import { Box, ButtonGroup, IconButton } from '@mui/material';
import { Create } from '@mui/icons-material';

import { PointData, ZetkinArea } from '../types';

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
  const reactFGref = useRef<FeatureGroup | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<PointData[] | null>(null);
  const [polygons, setPolygons] = useState<ZetkinArea[]>(areas);
  const drawingRef = useRef(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <Box>
        <ButtonGroup>
          <IconButton
            onClick={() => {
              if (drawingPoints) {
                if (drawingPoints.length > 2) {
                  setPolygons((current) => [
                    ...current,
                    { id: current.length + 1, points: drawingPoints },
                  ]);
                }
                setDrawingPoints(null);
                drawingRef.current = false;
              } else {
                setDrawingPoints([]);
                drawingRef.current = true;
              }
            }}
          >
            <Create color={drawingPoints ? 'primary' : 'secondary'} />
          </IconButton>
        </ButtonGroup>
      </Box>

      <Box flexGrow={1}>
        <MapContainer
          bounds={latLngBounds([54, 12], [56, 14])}
          style={{ height: '100%', width: '100%' }}
        >
          <MapWrapper>
            {(map) => {
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
                    {polygons.map((polygon) => (
                      <Polygon
                        key={polygon.id}
                        eventHandlers={{
                          click: () => {
                            alert('clicked polygon ' + polygon.id);
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
