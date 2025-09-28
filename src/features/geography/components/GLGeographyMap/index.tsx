import { Box, Button, ButtonGroup } from '@mui/material';
import { Close, Create, Save } from '@mui/icons-material';
import Map from '@vis.gl/react-maplibre';
import { FC, useEffect, useMemo, useState } from 'react';
import { LngLatBounds, Map as MapType, Point } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Zetkin2Area } from 'features/areas/types';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import AreaOverlay, {
  AREA_OVERLAY_WIDTH,
} from 'features/areas/components/AreaOverlay';
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
    () => areas.filter((area) => area.id != selectedArea?.id),
    [areas, selectedArea]
  );

  useEffect(() => {
    if (map && selectedArea) {
      const firstPolygon = selectedArea.boundary.coordinates[0];
      if (!firstPolygon?.length) {
        return;
      }

      const areaBounds = new LngLatBounds(firstPolygon[0], firstPolygon[0]);
      firstPolygon.forEach((lngLat) => areaBounds.extend(lngLat));

      const mapWidth = map.getContainer().clientWidth;
      const rightmostPartOfArea = map.project(areaBounds.getNorthEast()).x;

      const overlayWidth = AREA_OVERLAY_WIDTH + 16; // 16 = 1rem absolute positioning
      const overlayLeftEdge = mapWidth - overlayWidth;
      if (rightmostPartOfArea > overlayLeftEdge) {
        // The area is partially hidden behind the overlay
        // Zoom out (using fitBounds) so that the entire area is visible

        // The main rationale here is that we want to calculate the east point at `rightmostPartOfArea` plus have room for the overlay
        // To keep the proportions after the zoom, we calculate the ratio and apply it to the overlay
        const ratio = rightmostPartOfArea / overlayLeftEdge;
        const newHiddenAreaWidth = overlayWidth * ratio;
        const newEastPoint = map.unproject(
          new Point(rightmostPartOfArea + newHiddenAreaWidth, 0)
        );

        const newBounds = new LngLatBounds(
          map.getBounds().getSouthWest(),
          map.getBounds().getNorthEast()
        ).extend(newEastPoint);
        map.fitBounds(newBounds, {
          animate: true,
          duration: 800,
          padding: { right: 16 },
        });
      }
    }
  }, [map, selectedArea]);

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
        <Box display="flex" justifyContent="space-between" px={2} py={1}>
          <Box alignItems="center" display="flex" gap={1}>
            <ButtonGroup variant="contained">
              {!drawing && (
                <Button
                  onClick={() => {
                    startDrawing();
                  }}
                  startIcon={<Create />}
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
                  startIcon={<Close />}
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
                  startIcon={<Save />}
                >
                  <Msg id={messageIds.areas.draw.saveButton} />
                </Button>
              )}
            </ButtonGroup>
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
