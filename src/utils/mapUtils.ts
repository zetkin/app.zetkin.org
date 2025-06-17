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
