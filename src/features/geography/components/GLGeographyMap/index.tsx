import { Box, Button } from '@mui/material';
import Map from '@vis.gl/react-maplibre';
import { FC, useMemo, useState } from 'react';
import { Map as MapType } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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
import { Msg } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import useAreaDrawing from 'features/geography/hooks/useAreaDrawing';
import DrawingArea from './DrawingArea';

type Props = {
  areas: Zetkin2Area[];
  orgId: number;
};

const GLGeographyMap: FC<Props> = ({ areas, orgId }) => {
  const env = useEnv();
  const [map, setMap] = useState<MapType | null>(null);
  const bounds = useMapBounds({ areas, map });
  const { selectedArea, setSelectedId } = useAreaSelection({ areas, map });
  const {
    cancelDrawing,
    canFinishDrawing,
    creating,
    drawing,
    drawingPoints,
    finishDrawing,
    startDrawing,
  } = useAreaDrawing({ map, orgId, setSelectedId });
  const { draggingPoints, editing, editingArea, setEditing } = useAreaEditing({
    map,
    selectedArea,
  });

  const areasExceptSelected = useMemo(
    () => areas.filter((area) => area.id !== selectedArea?.id),
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
        <Box display="flex" justifyContent="flex-end" px={2} py={1}>
          <Box alignItems="center" display="flex" gap={1}>
            {!drawing && (
              <Button
                onClick={() => {
                  startDrawing();
                }}
                variant="contained"
              >
                <Msg id={messageIds.areas.draw.startButton} />
              </Button>
            )}
            {drawing && (
              <Button
                disabled={creating}
                onClick={() => {
                  cancelDrawing();
                }}
                variant="outlined"
              >
                <Msg id={messageIds.areas.draw.cancelButton} />
              </Button>
            )}
            {drawing && canFinishDrawing && (
              <Button
                loading={creating}
                onClick={() => {
                  finishDrawing();
                }}
                variant="contained"
              >
                <Msg id={messageIds.areas.draw.saveButton} />
              </Button>
            )}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
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
            RTLTextPlugin="/mapbox-gl-rtl-text-0.3.0.js"
          >
            <Areas areas={areasExceptSelected} />
            {!!drawingPoints && <DrawingArea drawingPoints={drawingPoints} />}

            {!!selectedArea && (
              <SelectedArea
                draggingPoints={draggingPoints}
                editingArea={editingArea}
                selectedArea={selectedArea}
              />
            )}
          </Map>
        </Box>
      </Box>
    </AreaFilterProvider>
  );
};

export default GLGeographyMap;
