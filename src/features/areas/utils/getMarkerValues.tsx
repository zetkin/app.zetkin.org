import { Map } from 'leaflet';

type Marker = {
  markerX: number;
  markerY: number;
};

const getMarkerValues = (map: Map, crosshair: HTMLDivElement): Marker => {
  const mapContainer = map.getContainer();
  const markerRect = crosshair.getBoundingClientRect();
  const mapRect = mapContainer.getBoundingClientRect();
  const x = markerRect.x - mapRect.x;
  const y = markerRect.y - mapRect.y;
  const markerX = x + 0.5 * markerRect.width;
  const markerY = y + 0.5 * markerRect.height;

  return { markerX, markerY };
};

export default getMarkerValues;
