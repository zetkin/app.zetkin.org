import { latLng, LatLng } from 'leaflet';

export default function objToLatLng(
  input: [number, number] | { lat: number; lng: number }
): LatLng {
  if ('lat' in input) {
    return latLng([input.lat, input.lng]);
  } else {
    return latLng(input);
  }
}
