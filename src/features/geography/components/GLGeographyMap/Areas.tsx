import { Layer, Marker, Source } from '@vis.gl/react-maplibre';
import { FC, useMemo } from 'react';
import { centerOfMass } from '@turf/center-of-mass';

import { Zetkin2Area } from 'features/areas/types';
import oldTheme from 'theme';
import HouseholdOverlayMarker from 'features/areas/components/markers/HouseholdOverlayMarker';

type Props = {
  areas: Zetkin2Area[];
};

const Areas: FC<Props> = ({ areas }) => {
  const areasGeoJson: GeoJSON.FeatureCollection<
    Zetkin2Area['boundary'],
    { id: number }
  > = useMemo(() => {
    return {
      features: areas.map((area) => ({
        geometry: area.boundary,
        properties: { id: area.id },
        type: 'Feature',
      })),
      type: 'FeatureCollection',
    };
  }, [areas]);

  return (
    <>
      {areasGeoJson.features.map((area) => {
        const center = centerOfMass(area);
        return (
          <Marker
            key={area.properties.id}
            anchor="top-left"
            latitude={center.geometry.coordinates[1]}
            longitude={center.geometry.coordinates[0]}
          >
            <HouseholdOverlayMarker
              numberOfHouseholds={15000}
              numberOfLocations={1000}
            />
          </Marker>
        );
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
