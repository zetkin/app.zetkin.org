import { Layer, Marker, Source } from '@vis.gl/react-maplibre';
import { LngLatBounds } from 'maplibre-gl';
import { FC, useMemo, useState } from 'react';
import { booleanIntersects, centerOfMass, polygon } from '@turf/turf';

import { Zetkin2Area } from 'features/areas/types';
import oldTheme from 'theme';
import HouseholdOverlayMarker from 'features/areas/components/markers/HouseholdOverlayMarker';
import useAreaStats from 'features/areas/hooks/useAreaStats';

type Props = {
  areas: Zetkin2Area[];
  bounds?: LngLatBounds;
};

const AreaMarker: FC<{ id: number; lat: number; lng: number }> = ({
  id,
  lat,
  lng,
}) => {
  const assignmentStats = useAreaStats(id);

  return (
    <Marker anchor="top-left" latitude={lat} longitude={lng}>
      <HouseholdOverlayMarker
        numberOfHouseholds={assignmentStats?.num_households || 0}
        numberOfLocations={assignmentStats?.num_locations || 0}
      />
    </Marker>
  );
};

const Areas: FC<Props> = ({ areas, bounds }) => {
  const [, setAreasInView] = useState<Zetkin2Area[]>([]);
  const areasGeoJson: GeoJSON.FeatureCollection<
    Zetkin2Area['boundary'],
    { id: number }
  > = useMemo(() => {
    return {
      features: areas.map((area) => {
        return {
          geometry: area.boundary,
          properties: { id: area.id },
          type: 'Feature',
        };
      }),
      type: 'FeatureCollection',
    };
  }, [areas]);

  // TODO: debounce
  if (bounds) {
    const boundingPolygon = polygon([
      [
        [bounds._ne.lng, bounds._ne.lat],
        [bounds._ne.lng, bounds._sw.lat],
        [bounds._sw.lng, bounds._sw.lat],
        [bounds._sw.lng, bounds._ne.lat],
        [bounds._ne.lng, bounds._ne.lat],
      ],
    ]);
    const areasWithinBounds = areas.filter((area) =>
      booleanIntersects(boundingPolygon, area.boundary)
    );
    setAreasInView(areasWithinBounds);
  }

  return (
    <>
      {areasGeoJson.features.map((area) => {
        const center = centerOfMass(area);

        //TODO: Remove if-statement
        if ([15, 16, 19, 28].includes(area.properties.id)) {
          return (
            <AreaMarker
              key={area.properties.id}
              id={area.properties.id}
              lat={center.geometry.coordinates[1]}
              lng={center.geometry.coordinates[0]}
            />
          );
        }
      })}
      <Source data={areasGeoJson} id="areas" type="geojson">
        <Layer
          id="outlines"
          paint={{
            'line-color': oldTheme.palette.secondary.main,
            'line-width': 2,
          }}
          type="line"
        />
        <Layer
          id="areas"
          paint={{
            'fill-color': oldTheme.palette.secondary.main,
            'fill-opacity': 0.4,
          }}
          type="fill"
        />
      </Source>
    </>
  );
};

export default Areas;
