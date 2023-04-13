import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import Fuse from 'fuse.js';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import { ZetkinLocation } from 'utils/types/zetkin';
import { icon, latLngBounds, Map as MapType } from 'leaflet';

const selectedIcon = icon({
  iconAnchor: [12, 32],
  iconSize: [25, 32],
  iconUrl: '/selectedMarker.png',
});

const basicIcon = icon({
  iconAnchor: [12, 32],
  iconSize: [25, 32],
  iconUrl: '/basicMarker.png',
});

interface MapProps {
  focusedMarker?: { lat: number; lng: number };
  locations: ZetkinLocation[];
  searchString: string;
  selectedLocation?: ZetkinLocation;
  onMapClick: (latlng: { lat: number; lng: number }) => void;
  onMarkerClick: (locationId: number) => void;
}

const MapProvider = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

const Map: FC<MapProps> = ({
  focusedMarker,
  locations,
  onMapClick,
  onMarkerClick,
  selectedLocation,
  searchString,
}) => {
  const fuse = new Fuse(locations, {
    keys: ['title'],
    threshold: 0.4,
  });

  const filteredLocations = searchString
    ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
    : locations;

  const bounds = latLngBounds(
    locations.map((location) => [location.lat, location.lng])
  );

  return (
    <MapContainer
      bounds={
        selectedLocation
          ? latLngBounds([[selectedLocation.lat, selectedLocation.lng]])
          : bounds
      }
      style={{ height: '80vh', width: '100%' }}
    >
      <MapProvider>
        {(map) => {
          if (focusedMarker) {
            map.setView(focusedMarker, 17);
          }
          map.on('click', (evt) => {
            onMapClick({ lat: evt.latlng.lat, lng: evt.latlng.lng });
          });
          return (
            <>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredLocations.map((location) => {
                return (
                  <Marker
                    key={location.id}
                    eventHandlers={{
                      click: (evt) => {
                        map.setView(evt.latlng, 17);
                        onMarkerClick(location.id);
                      },
                    }}
                    icon={
                      selectedLocation?.id === location.id
                        ? selectedIcon
                        : basicIcon
                    }
                    position={[location.lat, location.lng]}
                  />
                );
              })}
            </>
          );
        }}
      </MapProvider>
    </MapContainer>
  );
};

export default Map;
