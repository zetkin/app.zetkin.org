import { LatLngLiteral } from 'leaflet';

import { ZetkinLocation } from 'features/areaAssignments/types';

export default function locToLatLng(location: ZetkinLocation): LatLngLiteral {
  return {
    lat: location.latitude,
    lng: location.longitude,
  };
}
