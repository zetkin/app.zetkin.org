import { Latitude, Longitude, PointData } from 'features/areas/types';

export default function lngLat(numbers: [number, number]): PointData {
  return [numbers[0] as Longitude, numbers[1] as Latitude];
}
