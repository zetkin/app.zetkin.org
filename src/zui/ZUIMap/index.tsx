import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTheme } from '@mui/material';
import {
  divIcon,
  latLngBounds,
  LatLngLiteral,
  Map as LeafletMap,
} from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import BasicMarker from './BasicMarker';
import SelectedMarker from './SelectedMarker';
import { ZetkinLocation } from 'utils/types/zetkin';

const MapWrapper = ({
  children,
}: {
  children: (map: LeafletMap) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

export type LocationWithData<T = unknown> = ZetkinLocation & { data: T[] };

const ZUIMap = <T extends unknown>({
  center,
  locations,
  onClickLocation,
  selectedLocation,
}: {
  center?: LatLngLiteral;
  locations: LocationWithData<T>[];
  onClickLocation: (location: LocationWithData<T>) => void;
  selectedLocation?: LocationWithData<T>;
}) => {
  const theme = useTheme();

  return (
    <MapContainer
      bounds={
        locations.length
          ? latLngBounds(
              locations.map((location) => ({
                lat: location.lat,
                lng: location.lng,
              }))
            )
          : [
              [75, -170],
              [-60, 180],
            ]
      }
      style={{ height: '100%', width: '100%' }}
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

              {locations.map((location) => {
                return (
                  <Marker
                    key={location.id}
                    eventHandlers={{
                      click: () => {
                        onClickLocation(location);
                      },
                    }}
                    icon={
                      selectedLocation?.id === location.id
                        ? divIcon({
                            className: '',
                            html: renderToStaticMarkup(<SelectedMarker />),
                          })
                        : divIcon({
                            className: '',
                            html: renderToStaticMarkup(
                              <BasicMarker
                                color={theme.palette.primary.main}
                                events={location.data.length}
                              />
                            ),
                          })
                    }
                    position={[location.lat, location.lng]}
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

export default ZUIMap;
