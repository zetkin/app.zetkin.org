import { PointData, ZetkinArea } from '../types';

/**
 * Convert coordinates from backend format [lng, lat] to display format [lat, lng]
 */
export function backendToDisplay(point: PointData): PointData {
  return [point[1], point[0]]; // [lng, lat] -> [lat, lng]
}

/**
 * Convert coordinates from display format [lat, lng] to backend format [lng, lat]
 */
export function displayToBackend(point: PointData): PointData {
  return [point[1], point[0]]; // [lat, lng] -> [lng, lat]
}

/**
 * Convert array of coordinates from backend format to display format
 */
export function backendToDisplayArray(points: PointData[]): PointData[] {
  return points.map(backendToDisplay);
}

/**
 * Convert array of coordinates from display format to backend format
 */
export function displayToBackendArray(points: PointData[]): PointData[] {
  return points.map(displayToBackend);
}

/**
 * Extract the first polygon's coordinates from an area's boundary
 * For backward compatibility with components expecting a points array
 */
export function getAreaPoints(area: ZetkinArea): PointData[] {
  return area.boundary.coordinates[0] || [];
}

/**
 * Extract the first polygon's coordinates in display format [lat, lng]
 * For backward compatibility with components expecting a points array
 */
export function getAreaDisplayPoints(area: ZetkinArea): PointData[] {
  return backendToDisplayArray(getAreaPoints(area));
}

/**
 * Create a boundary structure from a points array
 * For converting from old points format to new boundary format
 */
export function createBoundaryFromPoints(points: PointData[]): {
  coordinates: PointData[][];
  type: 'Polygon';
} {
  return {
    coordinates: [points],
    type: 'Polygon',
  };
}
