import { LngLatBounds } from 'maplibre-gl';

import { PointData } from 'features/areas/types';

export function flipLatLng(latLng: [number, number]): [number, number] {
  const [lat, lng] = latLng;
  return [lng, lat];
}

export function pointsToBounds(coordinates: Array<PointData>) {
  if (coordinates.length === 0) {
    return null;
  }

  const [firstPoint, ...restPoints] = coordinates;

  const bounds = new LngLatBounds(
    flipLatLng(firstPoint),
    flipLatLng(firstPoint)
  );
  for (const point of restPoints) {
    bounds.extend(flipLatLng(point));
  }
  return bounds;
}
