import area from '@turf/area';
import { useEffect, useState } from 'react';
import { MapLayerMouseEvent, Map as MapType } from 'maplibre-gl';

import { Zetkin2Area } from 'features/areas/types';

type Props = {
  areas: Zetkin2Area[];
  map: MapType | null;
};

type Return = {
  selectedArea: Zetkin2Area | null;
  setSelectedId: (id: number) => void;
};

export default function useAreaSelection({ areas, map }: Props): Return {
  const [selectedId, setSelectedId] = useState(0);
  const selectedArea = areas.find((area) => area.id === selectedId) || null;

  useEffect(() => {
    if (map) {
      const handleClick = (ev: MapLayerMouseEvent) => {
        if (ev.features) {
          const sortedFeatures =
            ev.features.length > 1
              ? ev.features.sort((f0, f1) => area(f0) - area(f1))
              : ev.features;

          const firstFeature = sortedFeatures[0];

          if (firstFeature) {
            setSelectedId(firstFeature.properties.id);
          }
        }
      };

      map.on('click', 'areas', handleClick);
    }
  });

  return {
    selectedArea,
    setSelectedId,
  };
}
