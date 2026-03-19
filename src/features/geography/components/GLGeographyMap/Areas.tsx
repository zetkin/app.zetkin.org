import { Layer, Marker, Source } from '@vis.gl/react-maplibre';
import { FC } from 'react';
import { centerOfMass } from '@turf/turf';

import { Zetkin2Area, ZetkinAreaStats } from 'features/areas/types';
import oldTheme from 'theme';
import HouseholdOverlayMarker from 'features/areas/components/markers/HouseholdOverlayMarker';
import useAreasWithStats from 'features/geography/hooks/useAreasWithStats';

type Props = {
  areas: Zetkin2Area[];
  areasInView: Zetkin2Area[];
};

const AreaMarker: FC<{
  lat: number;
  lng: number;
  stats: ZetkinAreaStats | null;
}> = ({ lat, lng, stats }) => {
  return (
    <Marker anchor="top-left" latitude={lat} longitude={lng}>
      <HouseholdOverlayMarker
        numberOfHouseholds={stats?.num_households || 0}
        numberOfLocations={stats?.num_locations || 0}
      />
    </Marker>
  );
};

const Areas: FC<Props> = ({ areas, areasInView }) => {
  const areasWithStatsGeojson = useAreasWithStats(
    areas,
    areasInView.map((area) => area.id)
  );

  return (
    <>
      {areasWithStatsGeojson.features.map((area) => {
        const center = centerOfMass(area);

        return (
          <AreaMarker
            key={area.properties.id}
            lat={center.geometry.coordinates[1]}
            lng={center.geometry.coordinates[0]}
            stats={area.properties.stats}
          />
        );
      })}
      <Source data={areasWithStatsGeojson} id="areas" type="geojson">
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
