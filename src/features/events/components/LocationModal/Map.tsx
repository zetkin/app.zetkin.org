import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import Fuse from 'fuse.js';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/system';
import { FC, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import LocationDetailsCard from './LocationDetailsCard';
import LocationSearch from './LocationSearch';
import { ZetkinLocation } from 'utils/types/zetkin';
import { icon, latLng, latLngBounds, Map as MapType } from 'leaflet';

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

interface StyleProps {
  selectedLocation?: ZetkinLocation;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  mapContainer: {
    height: '80vh',
    width: '100%',
  },
  overlay: {
    bottom: ({ selectedLocation }) => (selectedLocation ? 1 : undefined),
    display: 'flex',
    justifyContent: 'flex-end',
    justifySelf: 'flex-end',
    margin: 2,
    position: 'absolute',
    right: 1,
    top: 1,
    width: '30%',
    zIndex: 1000,
  },
}));

interface MapProps {
  locations: ZetkinLocation[];
  locationId?: number;
  onMapClose: () => void;
  onSelectLocation: (location: ZetkinLocation) => void;
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
  locations,
  locationId,
  onMapClose,
  onSelectLocation,
}) => {
  const [searchString, setSearchString] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(
    locationId || undefined
  );

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

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId
  );
  const classes = useStyles({ selectedLocation });

  return (
    <MapContainer
      bounds={
        selectedLocation
          ? latLngBounds([[selectedLocation.lat, selectedLocation.lng]])
          : bounds
      }
      className={classes.mapContainer}
    >
      <MapProvider>
        {(map) => {
          return (
            <>
              <Box className={classes.overlay}>
                {!selectedLocation && (
                  <LocationSearch
                    onChange={(value) => {
                      const location = locations.find(
                        (location) => location.title === value
                      );
                      if (!location?.lat || !location?.lng) {
                        return;
                      }
                      map.setView(latLng(location.lat, location.lng), 17);
                    }}
                    onInputChange={(value) => {
                      setSearchString(value || '');
                      setSelectedLocationId(
                        locations.find((location) => location.title === value)
                          ?.id || undefined
                      );
                    }}
                    onTextFieldChange={(value) => setSearchString(value)}
                    options={locations.map((location) => location.title)}
                  />
                )}
                {selectedLocation && (
                  <LocationDetailsCard
                    onClose={() => {
                      setSearchString('');
                      setSelectedLocationId(undefined);
                    }}
                    onSelectLocation={() => {
                      onSelectLocation(selectedLocation);
                      onMapClose();
                    }}
                    selectedLocation={selectedLocation}
                  />
                )}
              </Box>
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
                        setSelectedLocationId(location.id);
                      },
                    }}
                    icon={
                      selectedLocationId === location.id
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
