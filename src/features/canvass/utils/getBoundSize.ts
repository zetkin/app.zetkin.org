import { latLngBounds } from 'leaflet';

import { ZetkinArea } from '../../areas/types';
import objToLatLng from '../../areas/utils/objToLatLng';

export const getBoundSize = (area: ZetkinArea): number => {
  const coordinates = area.boundary.coordinates[0] || [];

  const bounds0 = latLngBounds(coordinates.map(objToLatLng));
  const dx = bounds0.getEast() - bounds0.getWest();
  const dy = bounds0.getNorth() - bounds0.getSouth();
  return dx * dy;
};
