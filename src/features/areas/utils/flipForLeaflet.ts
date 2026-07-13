import { Latitude, Longitude } from '../types';

export default function flipForLeaflet(
  pointFromApi: [Longitude, Latitude]
): [Latitude, Longitude] {
  const [lng, lat] = pointFromApi;
  return [lat, lng];
}
