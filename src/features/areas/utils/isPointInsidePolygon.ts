import { LatLng } from 'leaflet';

/*** Stolen from comment on https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon */
export default function isPointInsidePolygon(point: LatLng, polygon: LatLng[]) {
  const x = point.lat;
  const y = point.lng;

  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    const intersects =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}
