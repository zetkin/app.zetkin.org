import 'leaflet/dist/leaflet.css';
import Fuse from 'fuse.js';
import { Autocomplete, Box, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import { icon, latLngBounds } from 'leaflet';

const customIcon = icon({
  iconAnchor: [12, 32],
  iconSize: [25, 32],
  iconUrl: '/selectedMarker.png',
});

interface MapProps {
  locations: ZetkinLocation[];
}

const Map: FC<MapProps> = ({ locations }) => {
  const messages = useMessages(messageIds);
  const [searchString, setSearchString] = useState('');
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
      {filteredLocations.map((location) => (
        <Marker
          key={location.id}
          icon={customIcon}
          position={[location.lat, location.lng]}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
