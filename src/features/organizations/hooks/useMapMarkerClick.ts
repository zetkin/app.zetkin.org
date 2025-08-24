import { useEffect } from 'react';
import { Map as MapType } from 'maplibre-gl';

export default function useMapMarkerClick(
  map: MapType | null,
  onMarkerClick?: (features: GeoJSON.Feature[]) => void
) {
  useEffect(() => {
    if (map) {
      map.on('click', 'locationMarkers', (event) => {
        if (event.features) {
          const geojsonFeatures = event.features.map((feature) => {
            const location = JSON.parse(feature?.properties?.location);
            return {
              geometry: {
                coordinates: [location.lat, location.lng],
                type: 'Point',
              },
              properties: {
                location,
              },
              type: 'Feature',
            };
          }) as GeoJSON.Feature[];

          if (onMarkerClick) {
            onMarkerClick(geojsonFeatures);
          }
        }
      });

      map.on('mouseenter', 'locationMarkers', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'locationMarkers', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  }, [map]);
}
