import { Layer, Marker, Source } from '@vis.gl/react-maplibre';
import { FC } from 'react';
import { centerOfMass } from '@turf/turf';

import { Zetkin2Area } from 'features/areas/types';
import oldTheme from 'theme';
import HouseholdOverlayMarker from 'features/areas/components/markers/HouseholdOverlayMarker';
import useAreasWithStats from 'features/areas/hooks/useAreasWithStats';

type Props = {
  areas: Zetkin2Area[];
  areasInView: Zetkin2Area[];
  onSelectArea: (areaId: number) => void;
  zoomLevel?: number;
};

const Areas: FC<Props> = ({
  areas,
  areasInView,
  onSelectArea,
  zoomLevel = 0,
}) => {
  const areasWithStatsGeojson = useAreasWithStats(
    areas,
    areasInView,
    zoomLevel
  );

  return (
    <>
      {areasWithStatsGeojson.features.map((area) => {
        const center = centerOfMass(area);

        if (zoomLevel > 10) {
          return (
            <Marker
              key={area.id}
              anchor="top-left"
              latitude={center.geometry.coordinates[1]}
              longitude={center.geometry.coordinates[0]}
              onClick={() => onSelectArea(area.properties.id)}
              style={{ cursor: 'pointer' }}
            >
              <HouseholdOverlayMarker
                numberOfHouseholds={area.properties.stats?.num_households || 0}
                numberOfLocations={area.properties.stats?.num_locations || 0}
              />
            </Marker>
          );
        }
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
