import { point, Point } from 'leaflet';

export default function objToPoint(
  input: [number, number] | { lat: number; lng: number }
): Point {
  if ('lat' in input) {
    return point([input.lat, input.lng]);
  } else {
    return point(input);
  }
}
