import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTheme } from '@mui/material';
import { divIcon, latLngBounds, LatLngLiteral, Map } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import BasicMarker from '../LocationModal/BasicMarker';
import { LocationWithEvents } from './groupEventsByLocation';

const MapWrapper = ({ children }: { children: (map: Map) => JSX.Element }) => {
  const map = useMap();
  return children(map);
};

const ActivistMap = ({
  center,
  locationsWithEvents,
  onLocationClick,
}: {
  center?: LatLngLiteral;
  locationsWithEvents: LocationWithEvents[];
  onLocationClick?: (location: LocationWithEvents) => void;
}) => {
  const theme = useTheme();

  return (
    <MapContainer
      bounds={
        locationsWithEvents.length
          ? latLngBounds(
              locationsWithEvents.map(({ location }) => ({
                lat: location.lat,
                lng: location.lng,
              }))
            )
          : [
              [75, -170],
              [-60, 180],
            ]
      }
      style={{ height: '100vh', width: '100%' }}
    >
      <MapWrapper>
        {(map) => {
          // Set map center if set externally
          if (center) {
            map.setView(center, 13);
          }
          return (
            <>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {locationsWithEvents.map((location) => {
                return (
                  <Marker
                    key={location.location.id}
                    eventHandlers={{
                      click: () => {
                        onLocationClick ? onLocationClick(location) : null;
                      },
                    }}
                    icon={divIcon({
                      className: '',
                      html: renderToStaticMarkup(
                        <BasicMarker
                          color={theme.palette.primary.main}
                          events={0}
                        />
                      ),
                    })}
                    position={[location.location.lat, location.location.lng]}
                  />
                );
              })}
            </>
          );
        }}
      </MapWrapper>
    </MapContainer>
  );
};

export default ActivistMap;
