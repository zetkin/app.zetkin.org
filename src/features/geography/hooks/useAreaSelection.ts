import area from '@turf/area';
import { useEffect, useState } from 'react';
import { MapLayerMouseEvent, Map as MapType } from 'maplibre-gl';

import { Zetkin2Area } from 'features/areas/types';

type Props = {
  areas: Zetkin2Area[];
  map: MapType | null;
  onSelectFromMap?: (id: number) => void;
};

type Return = {
  selectedArea: Zetkin2Area | null;
  setSelectedId: (id: number) => void;
};

export default function useAreaSelection({
  areas,
  map,
  onSelectFromMap,
}: Props): Return {
  const [selectedId, setSelectedId] = useState(0);
  const selectedArea = areas.find((area) => area.id == selectedId) || null;

  useEffect(() => {
    if (!map) {
      return;
    }

    const handleClick = (ev: MapLayerMouseEvent) => {
      if (!ev.features || ev.features.length === 0) {
        return;
      }

      const featuresBySmallestFirst =
        ev.features.length > 1
          ? [...ev.features].sort(
              (feature0, feature2) => area(feature0) - area(feature2)
            )
          : ev.features;

      const feature = featuresBySmallestFirst[0];
      const id = Number(feature?.properties?.id);

      if (!Number.isFinite(id)) {
        return;
      }

      setSelectedId(id);
      onSelectFromMap?.(id);
    };

    map.on('click', 'areas', handleClick);

    return () => {
      map.off('click', 'areas', handleClick);
    };
  }, [map, onSelectFromMap]);

  return {
    selectedArea,
    setSelectedId,
  };
}
