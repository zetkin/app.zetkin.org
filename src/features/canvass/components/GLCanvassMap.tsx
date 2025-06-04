import { FC, useMemo } from 'react';
import { Layer, LngLatLike, Map, Source } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Zetkin2Area } from 'features/areas/types';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';
import useLocations from 'features/areaAssignments/hooks/useLocations';

type Props = {
  areas: Zetkin2Area[];
  assignment: ZetkinAreaAssignment;
};

const GLCanvassMap: FC<Props> = ({ areas, assignment }) => {
  const locations = useLocations(assignment.organization_id, assignment.id);

  const areasGeoJson: GeoJSON.GeoJSON = useMemo(() => {
    const earthCover = [
      [180, 90],
      [180, -90],
      [-180, -90],
      [-180, 90],
      [180, 90],
    ];

    const areaHoles = areas.map((area) =>
      area.boundary.coordinates.flatMap((polygon) =>
        polygon.map(([lat, lng]) => [lng, lat])
      )
    );

    return {
      geometry: {
        coordinates: [earthCover, ...areaHoles],
        type: 'Polygon',
      },
      properties: {},
      type: 'Feature',
    };
  }, [areas]);

  const bounds: [LngLatLike, LngLatLike] = useMemo(() => {
    const min: LngLatLike = [180, 90];
    const max: LngLatLike = [-180, -90];

    areas.forEach((area) => {
      area.boundary.coordinates.forEach((polygon) => {
        polygon.forEach((point) => {
          const [lat, lng] = point;

          min[0] = Math.min(min[0], lng);
          min[1] = Math.min(min[1], lat);

          max[0] = Math.max(max[0], lng);
          max[1] = Math.max(max[1], lat);
        });
      });
    });

    return [min, max];
  }, [areas]);

  const locationsGeoJson: GeoJSON.GeoJSON = useMemo(() => {
    return {
      features:
        locations.data?.map((location) => ({
          geometry: {
            coordinates: [location.longitude, location.latitude],
            type: 'Point',
          },
          properties: {},
          type: 'Feature',
        })) ?? [],
      type: 'FeatureCollection',
    };
  }, [locations.data]);

  if (!locations.data) {
    return null;
  }

  return (
    <Map
      initialViewState={{
        bounds,
      }}
      mapStyle="https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
      style={{ height: '100%', width: '100%' }}
    >
      <Source data={areasGeoJson} id="areas" type="geojson">
        <Layer
          id="areaFill"
          paint={{ 'fill-color': '#000', 'fill-opacity': 0.4 }}
          source="areas"
          type="fill"
        />
      </Source>
      <Source data={locationsGeoJson} id="locations" type="geojson">
        <Layer id="locationMarkers" source="locations" type="circle" />
      </Source>
    </Map>
  );
};

export default GLCanvassMap;
