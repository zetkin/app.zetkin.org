import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Pentagon } from '@mui/icons-material';
import Map from '@vis.gl/react-maplibre';
import { FC, startTransition, useMemo, useState } from 'react';
import { Map as MapType } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Fuse from 'fuse.js';

import { Zetkin2Area } from 'features/areas/types';
import ZUIMapControls from 'zui/ZUIMapControls';
import { useEnv } from 'core/hooks';
import AreaOverlay from 'features/areas/components/AreaOverlay';
import oldAreaFormat from 'features/areas/utils/oldAreaFormat';
import useAreaEditing from 'features/geography/hooks/useAreaEditing';
import useAreaSelection from 'features/geography/hooks/useAreaSelection';
import SelectedArea from './SelectedArea';
import useMapBounds from 'features/geography/hooks/useMapBounds';
import Areas from './Areas';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import useAreaDrawing from 'features/geography/hooks/useAreaDrawing';
import DrawingArea from './DrawingArea';
import AreaSelectPanel from './AreaSelectPanel';

type Props = {
  areas: Zetkin2Area[];
  orgId: number;
};

const NO_SELECTED_AREA_ID = 0;
const SETTINGS_PANEL_WIDTH_PX = 400;
const SETTINGS_PANEL_GAP_PX = 8;

const GLGeographyMapInner: FC<Props> = ({ areas, orgId }) => {
  const env = useEnv();
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [isAreasPanelOpen, setIsAreasPanelOpen] = useState(false);
  const [areaSearchQuery, setAreaSearchQuery] = useState('');
  const [map, setMap] = useState<MapType | null>(null);
  const bounds = useMapBounds({ areas, map });
  const { selectedArea, setSelectedId } = useAreaSelection({
    areas,
    map,
    onSelectFromMap: () => {
      startTransition(() => {
        setIsAreasPanelOpen(false);
      });
    },
  });
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

  const normalizedSearchQuery = areaSearchQuery.trim().toLowerCase();
  const areaFuse = useMemo(
    () =>
      new Fuse(areas, {
        keys: ['title', 'description'],
        threshold: 0.4,
      }),
    [areas]
  );
  const matchingAreas = useMemo(() => {
    if (!normalizedSearchQuery) {
      return areas;
    }

    return areaFuse.search(normalizedSearchQuery).map((result) => result.item);
  }, [areas, areaFuse, normalizedSearchQuery]);

  const visibleAreas = useMemo(
    () => matchingAreas.filter((area) => area.id !== selectedArea?.id),
    [matchingAreas, selectedArea]
  );

  const rightSideOverlayOpen = isAreasPanelOpen || !!selectedArea;

  const closePanelAndResetSearch = () => {
    startTransition(() => {
      setIsAreasPanelOpen(false);
      setAreaSearchQuery('');
    });
  };

  const handleAreasPanelButtonClick = () => {
    if (isAreasPanelOpen || selectedArea) {
      closePanelAndResetSearch();
      setSelectedId(NO_SELECTED_AREA_ID);
    } else {
      startTransition(() => {
        setIsAreasPanelOpen(true);
      });
    }
  };

  return (
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
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            transform: rightSideOverlayOpen
              ? `translate(-${
                  SETTINGS_PANEL_WIDTH_PX + SETTINGS_PANEL_GAP_PX
                }px)`
              : '',
            zIndex: 1100,
          }}
        >
          <ButtonGroup
            orientation="vertical"
            sx={{
              '& .MuiButton-root': {
                height: 40,
                width: 40,
              },
              bgcolor: theme.palette.background.default,
            }}
            variant="outlined"
          >
            <Tooltip
              placement="left"
              title={messages.areas.controlLabels.select()}
            >
              <Button onClick={handleAreasPanelButtonClick}>
                <Pentagon />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>
        {isAreasPanelOpen && (
          <Paper
            sx={{
              bottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: SETTINGS_PANEL_WIDTH_PX,
              minWidth: SETTINGS_PANEL_WIDTH_PX,
              overflow: 'hidden',
              paddingX: 0,
              paddingY: 1,
              position: 'absolute',
              right: '1rem',
              top: '1rem',
              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  height: '100%',
                  overflowY: 'auto',
                  paddingBottom: 4,
                  paddingX: 2,
                }}
              >
                <AreaSelectPanel
                  matchingAreas={matchingAreas}
                  onBackToList={() => undefined}
                  onClose={closePanelAndResetSearch}
                  onSearchQueryChange={(newValue) =>
                    setAreaSearchQuery(newValue)
                  }
                  onSelectAreaId={(newValue) =>
                    startTransition(() => {
                      setSelectedId(newValue);
                      setIsAreasPanelOpen(false);
                      setAreaSearchQuery('');
                    })
                  }
                  searchQuery={areaSearchQuery}
                  selectedArea={null}
                />
              </Box>
            </Box>
          </Paper>
        )}
        {selectedArea && !isAreasPanelOpen && (
          <AreaOverlay
            area={
              editingArea
                ? oldAreaFormat(editingArea)
                : oldAreaFormat(selectedArea)
            }
            editing={editing}
            onBeginEdit={() => setEditing(true)}
            onCancelEdit={() => setEditing(false)}
            onClose={() => {
              setSelectedId(NO_SELECTED_AREA_ID);
              setAreaSearchQuery('');
            }}
          />
        )}
        <Map
          ref={(map) => setMap(map?.getMap() ?? null)}
          initialViewState={{ bounds }}
          mapStyle={env.vars.MAPLIBRE_STYLE}
          RTLTextPlugin="/mapbox-gl-rtl-text-0.3.0.js"
        >
          <Areas areas={visibleAreas} />
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
  );
};

const GLGeographyMap: FC<Props> = (props) => <GLGeographyMapInner {...props} />;

export default GLGeographyMap;
