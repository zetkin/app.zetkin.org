import 'leaflet/dist/leaflet.css';
import Fuse from 'fuse.js';
import { FC, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import { ZetkinLocation } from 'utils/types/zetkin';
import {
  icon,
  latLngBounds,
  Map as MapType,
  Marker as MarkerType,
} from 'leaflet';

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
  inMoveState: boolean;
  locations: ZetkinLocation[];
  onMapClick: (latlng: Pick<ZetkinLocation, 'lat' | 'lng'>) => void;
  onMarkerClick: (locationId: number) => void;
  onMarkerDragEnd: (lat: number, lng: number) => void;
  pendingLocation: Pick<ZetkinLocation, 'lat' | 'lng'> | null;
  searchString: string;
  selectedLocation?: ZetkinLocation;
}

const MapWrapper = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

const Map: FC<MapProps> = ({
  inMoveState,
  locations,
  onMapClick,
  onMarkerClick,
  onMarkerDragEnd,
  pendingLocation,
  selectedLocation,
  searchString,
}) => {
  const [newPosition, setNewPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const selectedMarkerRef = useRef<MarkerType>(null);

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
      <MapWrapper>
        {(map) => {
          if (selectedLocation) {
            map.setView(
              { lat: selectedLocation.lat, lng: selectedLocation.lng },
              17
            );
          }

          map.on('click', (evt) => {
            const lat = evt.latlng.lat;
            const lng = evt.latlng.lng;

            onMapClick({ lat, lng });
          });

          return (
            <>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredLocations.map((location) => {
                const isSelectedMarker = selectedLocation?.id == location.id;
                return (
                  <Marker
                    key={location.id}
                    ref={
                      inMoveState && isSelectedMarker ? selectedMarkerRef : null
                    }
                    draggable={inMoveState && isSelectedMarker}
                    eventHandlers={{
                      click: (evt) => {
                        setNewPosition(null);
                        map.setView(evt.latlng, 17);
                        onMarkerClick(location.id);
                      },
                      dragend: () => {
                        const marker = selectedMarkerRef.current;
                        if (marker !== null) {
                          setNewPosition(marker.getLatLng());
                          onMarkerDragEnd(
                            marker.getLatLng().lat,
                            marker.getLatLng().lng
                          );
                        }
                      },
                    }}
                    icon={isSelectedMarker ? selectedIcon : basicIcon}
                    position={
                      isSelectedMarker && newPosition && inMoveState
                        ? newPosition
                        : [location.lat, location.lng]
                    }
                  />
                );
              })}
              {pendingLocation && (
                <Marker
                  icon={selectedIcon}
                  position={[pendingLocation.lat, pendingLocation.lng]}
                />
              )}
            </>
          );
        }}
      </MapWrapper>
    </MapContainer>
  );
};

export default Map;
