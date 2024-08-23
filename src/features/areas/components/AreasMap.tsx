import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/images/spritesheet.png';
import 'leaflet-draw/dist/images/spritesheet-2x.png';
import { FC, useRef } from 'react';
import {
  FeatureGroup as FGComponent,
  MapContainer,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { FeatureGroup, latLngBounds, Map as MapType } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';

interface MapProps {}

const MapWrapper = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};
const Map: FC<MapProps> = () => {
  const reactFGref = useRef<FeatureGroup | null>(null);

  return (
    <MapContainer
      bounds={latLngBounds([54, 12], [56, 14])}
      style={{ height: '100%', width: '100%' }}
    >
      <MapWrapper>
        {() => {
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
                <EditControl
                  draw={{
                    circle: false,
                    circlemarker: false,
                    marker: false,
                    polygon: true,
                    polyline: false,
                    rectangle: false,
                  }}
                  edit={null}
                  position="topright"
                />
              </FGComponent>
            </>
          );
        }}
      </MapWrapper>
    </MapContainer>
  );
};

export default Map;
