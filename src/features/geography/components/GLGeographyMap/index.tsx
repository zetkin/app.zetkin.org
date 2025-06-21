import { Box } from '@mui/material';
import Map from '@vis.gl/react-maplibre';
import { FC, useMemo, useState } from 'react';
import { Map as MapType } from 'maplibre-gl';

import { Zetkin2Area } from 'features/areas/types';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import AreaOverlay from 'features/areas/components/AreaOverlay';
import oldAreaFormat from 'features/areas/utils/oldAreaFormat';
import useAreaEditing from 'features/geography/hooks/useAreaEditing';
import useAreaSelection from 'features/geography/hooks/useAreaSelection';
import SelectedArea from './SelectedArea';
import useMapBounds from 'features/geography/hooks/useMapBounds';
import Areas from './Areas';

type Props = {
  areas: Zetkin2Area[];
};

const GLGeographyMap: FC<Props> = ({ areas }) => {
  const env = useEnv();
  const [map, setMap] = useState<MapType | null>(null);
  const bounds = useMapBounds({ areas, map });
  const { selectedArea, setSelectedId } = useAreaSelection({ areas, map });
  const { draggingPoints, editing, editingArea, setEditing } = useAreaEditing({
    map,
    selectedArea,
  });

  const areasExceptSelected = useMemo(
    () => areas.filter((area) => area.id != selectedArea?.id),
    [areas, selectedArea]
  );

  return (
    <AreaFilterProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <ZUIMapControls
          onFitBounds={() => {
            if (map) {
              map.fitBounds(bounds, { animate: true, duration: 800 });
            }
          }}
          onGeolocate={(lngLat) => {
            map?.panTo(lngLat, { animate: true, duration: 800 });
          }}
          onZoomIn={() => map?.zoomIn()}
          onZoomOut={() => map?.zoomOut()}
        />
        {selectedArea && (
          <AreaOverlay
            area={
              editingArea
                ? oldAreaFormat(editingArea)
                : oldAreaFormat(selectedArea)
            }
            editing={editing}
            onBeginEdit={() => setEditing(true)}
            onCancelEdit={() => setEditing(false)}
            onClose={() => setSelectedId(0)}
          />
        )}
        <Map
          ref={(map) => setMap(map?.getMap() ?? null)}
          initialViewState={{ bounds }}
          mapStyle={env.vars.MAPLIBRE_STYLE}
          onClick={(ev) => {
            ev.target.panTo(ev.lngLat, { animate: true });
          }}
          style={{ height: '100%', width: '100%' }}
        >
          <Areas areas={areasExceptSelected} />
          {!!selectedArea && (
            <SelectedArea
              draggingPoints={draggingPoints}
              editingArea={editingArea}
              selectedArea={selectedArea}
            />
          )}
        </Map>
      </Box>
    </AreaFilterProvider>
  );
};

export default GLGeographyMap;
