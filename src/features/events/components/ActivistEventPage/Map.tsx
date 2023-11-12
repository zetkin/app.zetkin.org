import 'leaflet/dist/leaflet.css';
import { CSSProperties } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon, latLngBounds, Map as MapType } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import SelectedMarker from 'features/events/components/LocationModal/SelectedMarker';

const MapWrapper = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

type MapProps = {
  interactive: boolean;
  location: {
    id: number;
    lat: number;
    lng: number;
  };
  style: CSSProperties;
  zoomLevel: number;
};

const Map = ({ interactive, location, style, zoomLevel }: MapProps) => {
  return (
    <MapContainer
      bounds={latLngBounds([[location.lat, location.lng]])}
      boxZoom={interactive}
      doubleClickZoom={interactive}
      dragging={interactive}
      keyboard={interactive}
      scrollWheelZoom={interactive}
      style={style}
      touchZoom={interactive}
      zoomControl={interactive}
    >
      <MapWrapper>
        {(map) => {
          map.setView({ lat: location.lat, lng: location.lng }, zoomLevel);

          return (
            <>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                key={location.id}
                icon={divIcon({
                  className: '',
                  html: renderToStaticMarkup(
                    <SelectedMarker
                      style={{ transform: 'translate(-50%, -100%)' }}
                    />
                  ),
                  iconAnchor: [0, 0],
                })}
                position={[location.lat, location.lng]}
              />
            </>
          );
        }}
      </MapWrapper>
    </MapContainer>
  );
};

export default Map;
