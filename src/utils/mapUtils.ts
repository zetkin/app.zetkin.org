import { LngLatBounds } from 'maplibre-gl';

import { PointData } from 'features/areas/types';

export function pointsToBounds(coordinates: Array<PointData>) {
  if (coordinates.length === 0) {
    return null;
  }

  const [firstPoint, ...restPoints] = coordinates;

  const bounds = new LngLatBounds(firstPoint, firstPoint);
  for (const point of restPoints) {
    bounds.extend(point);
  }
  return bounds;
}

export function isLngLatValue(
  value: unknown
): value is { lat: number; lng: number } {
  return (
    value != null &&
    typeof value == 'object' &&
    'lng' in value &&
    'lat' in value &&
    typeof value['lng'] == 'number' &&
    typeof value['lat'] == 'number'
  );
}
