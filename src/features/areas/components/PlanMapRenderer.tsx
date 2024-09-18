import { FC, useEffect, useRef, useState } from 'react';
import {
  AttributionControl,
  FeatureGroup,
  Polygon,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import { FeatureGroup as FeatureGroupType } from 'leaflet';
import { useTheme } from '@mui/styles';

import { ZetkinArea } from '../types';

type PlanMapRendererProps = {
  areas: ZetkinArea[];
  onSelectedIdChange: (newId: string) => void;
  selectedId: string;
};

const PlanMapRenderer: FC<PlanMapRendererProps> = ({
  areas,
  selectedId,
  onSelectedIdChange,
}) => {
  const theme = useTheme();
  const reactFGref = useRef<FeatureGroupType | null>(null);

  const [zoomed, setZoomed] = useState(false);

  const map = useMapEvents({
    zoom: () => {
      setZoomed(true);
    },
  });

  useEffect(() => {
    if (map && !zoomed) {
      const bounds = reactFGref.current?.getBounds();
      if (bounds?.isValid()) {
        map.fitBounds(bounds);
        setZoomed(true);
      }
    }
  }, [areas, map]);
  return (
    <>
      <AttributionControl position="bottomright" prefix={false} />
      <TileLayer
        attribution="<span style='color:#a3a3a3;'>Leaflet & OpenStreetMap</span>"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup
        ref={(fgRef) => {
          reactFGref.current = fgRef;
        }}
      >
        {areas.map((area) => {
          const selected = selectedId == area.id;

          // The key changes when selected, to force redraw of polygon
          // to reflect new state through visual style
          const key = area.id + (selected ? '-selected' : '-default');

          return (
            <Polygon
              key={key}
              color={theme.palette.primary.main}
              eventHandlers={{
                click: () => {
                  onSelectedIdChange(area.id);
                },
              }}
              positions={area.points}
              weight={selected ? 5 : 2}
            />
          );
        })}
      </FeatureGroup>
    </>
  );
};

export default PlanMapRenderer;
