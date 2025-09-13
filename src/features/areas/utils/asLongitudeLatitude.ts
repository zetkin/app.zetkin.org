import { Latitude, Longitude } from 'features/areas/types';

export function asLongitude(num: number): Longitude {
  return num as Longitude;
}

export function asLatitude(num: number): Latitude {
  return num as Latitude;
}
