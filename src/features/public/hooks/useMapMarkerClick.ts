import { useEffect } from 'react';
import { Map as MapType, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { GeoJSON } from 'geojson';

export default function useMapMarkerClick(
  map: MapType | null,
  onMarkerClick?: (features: GeoJSON.Feature[]) => void
) {
  useEffect(() => {
    if (!map) {
      return;
    }

    const onClick = (
      event: MapMouseEvent & { features?: MapGeoJSONFeature[] }
    ) => {
      if (event.features) {
        const geojsonFeatures: GeoJSON.Feature[] = event.features.map(
          (feature) => {
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
          }
        );

        if (onMarkerClick) {
          onMarkerClick(geojsonFeatures);
        }
      }
    };

    const onMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };

    const onMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', 'locationMarkers', onClick);
    map.on('mouseenter', 'locationMarkers', onMouseEnter);
    map.on('mouseleave', 'locationMarkers', onMouseLeave);

    return () => {
      map.off('click', 'locationMarkers', onClick);
      map.off('mouseenter', 'locationMarkers', onMouseEnter);
      map.off('mouseleave', 'locationMarkers', onMouseLeave);
    };
  }, [map, onMarkerClick]);
}
