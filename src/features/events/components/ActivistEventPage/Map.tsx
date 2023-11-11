import 'leaflet/dist/leaflet.css';
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
  location: {
    id: number;
    lat: number;
    lng: number;
  };
};

const Map = ({ location }: MapProps) => {
  return (
    <MapContainer
      bounds={latLngBounds([[location.lat, location.lng]])}
      style={{ height: '80vh', width: '100%' }}
    >
      <MapWrapper>
        {(map) => {
          map.setView({ lat: location.lat, lng: location.lng }, 17);

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
                  html: renderToStaticMarkup(<SelectedMarker />),
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
