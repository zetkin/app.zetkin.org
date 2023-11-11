import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTheme } from '@mui/material';
import { divIcon, latLngBounds, Map } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import BasicMarker from '../LocationModal/BasicMarker';
import { EventActivity } from 'features/campaigns/types';
import groupEventsByLocation from './groupEventsByLocation';

const MapWrapper = ({ children }: { children: (map: Map) => JSX.Element }) => {
  const map = useMap();
  return children(map);
};

const ActivistMap = ({ events }: { events: EventActivity[] }) => {
  const theme = useTheme();

  const groupedEvents = groupEventsByLocation(events);

  return (
    <MapContainer
      bounds={latLngBounds([
        [75, -170],
        [-60, 180],
      ])}
      style={{ height: '100vh', width: '100%' }}
    >
      <MapWrapper>
        {() => {
          return (
            <>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {groupedEvents.map((locationGroup) => {
                return (
                  <Marker
                    key={locationGroup.location.id}
                    icon={divIcon({
                      className: '',
                      html: renderToStaticMarkup(
                        <BasicMarker
                          color={theme.palette.primary.main}
                          events={0}
                        />
                      ),
                    })}
                    position={[
                      locationGroup.location.lat,
                      locationGroup.location.lng,
                    ]}
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
