import 'leaflet/dist/leaflet.css';
import Fuse from 'fuse.js';
import { Autocomplete, Box, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
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
  locations: ZetkinLocation[];
}

const MapProvider = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

const Map: FC<MapProps> = ({ locations }) => {
  const messages = useMessages(messageIds);
  const [searchString, setSearchString] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<
    number | undefined
  >();

  const bounds = latLngBounds(
    locations.map((location) => [location.lat, location.lng])
  );

  const fuse = new Fuse(locations, {
    keys: ['title'],
    threshold: 0.4,
  });

  const filteredLocations = searchString
    ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
    : locations;

  return (
    <MapContainer bounds={bounds} style={{ height: '100%', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 2,
          position: 'relative',
          width: '100%',
          zIndex: 10000,
        }}
      >
        <Autocomplete
          onChange={(ev) => {
            const event = ev.target as HTMLLIElement;
            const text = event.textContent;
            setSearchString(text || '');
          }}
          options={locations.map((location) => location.title)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={messages.locationModal.searchBox()}
              onChange={(ev) => setSearchString(ev.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: '5px',
              }}
            />
          )}
          sx={{ minWidth: '200px', width: '25%' }}
        />
      </Box>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filteredLocations.map((location) => {
        return (
          <MapProvider key={location.id}>
            {(map) => (
              <Marker
                eventHandlers={{
                  click: (evt) => {
                    map.setView(evt.latlng, 17);
                    setSelectedLocationId(location.id);
                  },
                }}
                icon={
                  selectedLocationId === location.id ? selectedIcon : basicIcon
                }
                position={[location.lat, location.lng]}
              />
            )}
          </MapProvider>
        );
      })}
    </MapContainer>
  );
};

export default Map;
