import { Layer, Marker, Source } from '@vis.gl/react-maplibre';
import { FC, useMemo } from 'react';
import { centerOfMass } from '@turf/turf';

import { Zetkin2Area, ZetkinAreaStats } from 'features/areas/types';
import oldTheme from 'theme';
import HouseholdOverlayMarker from 'features/areas/components/markers/HouseholdOverlayMarker';
import useAreaStats from 'features/areas/hooks/useAreaStats';
import { useApiClient, useAppSelector } from 'core/hooks';
import { statsLoad } from 'features/areaAssignments/store';
import {
  assignmentStatsLoad,
  assignmentStatsLoaded,
} from 'features/areas/store';

type Props = {
  areas: Zetkin2Area[];
  areasInView: Zetkin2Area[];
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

const useAreasWithStats = (areas: Zetkin2Area[], visibleAreaIds: number[]) => {
  Promise.all(
    visibleAreaIds.map(async (areaId) => {
      try {
        if ([15, 16, 19, 28].includes(areaId)) {
          assignmentStatsLoad(areaId);
          const res = await fetch(`/areaAssignmentStats/${areaId}.json`);
          const stats = await res.json();
          assignmentStatsLoaded([areaId, stats]);
        }
      } catch {
        return;
      }
    })
  );

  const statsForAreas = useAppSelector(
    (state) => state.areas.assignmentStatsByAreaId
  );

  console.log({ statsForAreas });

  const areasWithStatsGeojson: GeoJSON.FeatureCollection<
    Zetkin2Area['boundary'],
    { id: number }
  > = useMemo(() => {
    return {
      features: areas.map((area) => {
        return {
          geometry: area.boundary,
          properties: { id: area.id, stats: {} },
          type: 'Feature',
        };
      }),
      type: 'FeatureCollection',
    };
  }, [areas]);

  return areasWithStatsGeojson;
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
            id={area.properties.id}
            lat={center.geometry.coordinates[1]}
            lng={center.geometry.coordinates[0]}
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
