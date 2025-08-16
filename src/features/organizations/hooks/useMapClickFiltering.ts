import { Map as MapType } from 'maplibre-gl';

import { useAppDispatch } from 'core/hooks';
import useMapMarkerClick from './useMapMarkerClick';
import { pointsToBounds } from 'utils/mapUtils';
import { filtersUpdated } from '../store';
import { Latitude, Longitude } from 'features/areas/types';

export default function useMapClickFiltering(map: MapType | null) {
  const dispatch = useAppDispatch();

  const onMarkerClick = (geojsonFeatures: GeoJSON.Feature[]) => {
    const bounds = pointsToBounds(
      geojsonFeatures.map((feature) => {
        if (feature.geometry.type === 'Point') {
          return [
            feature.geometry.coordinates[1] as Longitude,
            feature.geometry.coordinates[0] as Latitude,
          ];
        } else {
          return [0 as Longitude, 0 as Latitude];
        }
      })
    );

    if (map && bounds) {
      map.fitBounds(bounds, {
        animate: true,
        duration: 1200,
        maxZoom: 16,
        padding: 20,
      });
    }

    dispatch(
      filtersUpdated({
        geojsonToFilterBy: geojsonFeatures,
      })
    );
  };

  useMapMarkerClick(map, onMarkerClick);
}
