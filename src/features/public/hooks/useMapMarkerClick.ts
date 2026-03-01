import { useEffect } from 'react';
import {
  GeoJSONSource,
  Map as MapType,
  MapGeoJSONFeature,
  MapMouseEvent,
} from 'maplibre-gl';
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
                coordinates: [location.lng, location.lat],
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

    const onClickClusters = async (
      event: MapMouseEvent & { features?: MapGeoJSONFeature[] }
    ) => {
      const feature = event.features?.[0];
      if (!feature || !map) {
        return;
      }

      const clusterId = feature.properties?.cluster_id;

      const leaves = await map
        .getSource<GeoJSONSource>('locations')
        ?.getClusterLeaves(clusterId, Infinity, 0);
      if (!leaves) {
        return;
      }

      onMarkerClick?.(leaves as GeoJSON.Feature[]);
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
    map.on('click', 'clusters', onClickClusters);
    map.on('mouseenter', 'clusters', onMouseEnter);
    map.on('mouseleave', 'clusters', onMouseLeave);

    return () => {
      map.off('click', 'locationMarkers', onClick);
      map.off('mouseenter', 'locationMarkers', onMouseEnter);
      map.off('mouseleave', 'locationMarkers', onMouseLeave);
      map.off('click', 'clusters', onClick);
      map.off('mouseenter', 'clusters', onMouseEnter);
      map.off('mouseleave', 'clusters', onMouseLeave);
    };
  }, [map, onMarkerClick]);
}
