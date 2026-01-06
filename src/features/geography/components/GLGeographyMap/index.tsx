import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Close, Layers, Pentagon } from '@mui/icons-material';
import Map from '@vis.gl/react-maplibre';
import { FC, startTransition, useState, useMemo } from 'react';
import { Map as MapType } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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
import useLocalStorage from 'zui/hooks/useLocalStorage';
import { MapStyle } from 'features/areaAssignments/components/OrganizerMap';
import messageIdsAss from 'features/areaAssignments/l10n/messageIds';
import AreaColorSettings from './AreaColorSettings';

type Props = {
  areas: Zetkin2Area[];
  orgId: number;
};

type SettingName = 'layers' | 'select';
type AreaLayerStyle = 'filled' | 'outlined' | 'hide';

const NO_SELECTED_AREA_ID = 0;
const SETTINGS_PANEL_WIDTH_PX = 400;
const SETTINGS_PANEL_GAP_PX = 8;

const GLGeographyMapInner: FC<Props> = ({ areas, orgId }) => {
  const env = useEnv();
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const [openSettingsPanel, setOpenSettingsPanel] =
    useState<SettingName | null>(null);
  const [areaSearchQuery, setAreaSearchQuery] = useState('');
  const [areaStyle, setAreaStyle] = useLocalStorage<MapStyle['area']>(
    `geographyAreaColor-${orgId}`,
    'assignees'
  );
  const [map, setMap] = useState<MapType | null>(null);
  const bounds = useMapBounds({ areas, map });
  const { selectedArea, setSelectedId } = useAreaSelection({
    areas,
    map,
    onSelectFromMap: () => {
      startTransition(() => {
        setOpenSettingsPanel(null);
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
  const matchingAreas = useMemo(() => {
    if (!normalizedSearchQuery) {
      return areas;
    }

    return areas.filter((area) => {
      const title = area.title?.toLowerCase() ?? '';
      const description = area.description?.toLowerCase() ?? '';

      return (
        title.includes(normalizedSearchQuery) ||
        description.includes(normalizedSearchQuery)
      );
    });
  }, [areas, normalizedSearchQuery]);

  const visibleAreas = useMemo(
    () => matchingAreas.filter((area) => area.id !== selectedArea?.id),
    [matchingAreas, selectedArea]
  );

  const areaLayerStyle: AreaLayerStyle =
    areaStyle === 'hide'
      ? 'hide'
      : areaStyle === 'outlined'
      ? 'outlined'
      : 'filled';

  const areaFillColor = useMemo(() => {
    if (areaLayerStyle !== 'filled') {
      return 'transparent';
    }

    return theme.palette.secondary.main;
  }, [areaLayerStyle, theme.palette.secondary.main]);

  const areaFillOpacity = useMemo(
    () => (areaStyle === 'households' ? 1 : 0.6),
    [areaStyle]
  );

  const rightSideOverlayOpen = openSettingsPanel !== null || !!selectedArea;

  const closePanelAndResetSearch = () => {
    startTransition(() => {
      setOpenSettingsPanel(null);
      setAreaSearchQuery('');
    });
  };

  const toggleSettingsPanel = (panelName: SettingName) => {
    if (openSettingsPanel === panelName) {
      closePanelAndResetSearch();
    } else {
      startTransition(() => {
        if (openSettingsPanel === 'select') {
          setAreaSearchQuery('');
        }
        setOpenSettingsPanel(panelName);
      });
    }
  };

  const handleSelectPanelButtonClick = () => {
    toggleSettingsPanel('select');
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
              title={messages.areas.controlLabels.layers()}
            >
              <Button onClick={() => toggleSettingsPanel('layers')}>
                <Layers />
              </Button>
            </Tooltip>
            <Tooltip
              placement="left"
              title={messages.areas.controlLabels.select()}
            >
              <Button onClick={handleSelectPanelButtonClick}>
                <Pentagon />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>
        {openSettingsPanel && (
          <Paper
            sx={{
              bottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: SETTINGS_PANEL_WIDTH_PX,
              minWidth: SETTINGS_PANEL_WIDTH_PX,
              overflow: 'hidden',
              paddingX: openSettingsPanel == 'select' ? 0 : 2,
              paddingY: 1,
              position: 'absolute',
              right: '1rem',
              top: '1rem',
              zIndex: 1000,
            }}
          >
            {openSettingsPanel == 'select' && (
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
                        setOpenSettingsPanel(null);
                        setAreaSearchQuery('');
                      })
                    }
                    searchQuery={areaSearchQuery}
                    selectedArea={null}
                  />
                </Box>
              </Box>
            )}
            {openSettingsPanel != 'select' && (
              <>
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography variant="h5">
                    <Msg id={messageIdsAss.map.mapStyle.title} />
                  </Typography>
                  <IconButton onClick={closePanelAndResetSearch}>
                    <Close />
                  </IconButton>
                </Box>
                <Divider />
                {openSettingsPanel == 'layers' && (
                  <AreaColorSettings
                    areaStyle={areaStyle}
                    onAreaStyleChange={(newValue) => setAreaStyle(newValue)}
                  />
                )}
              </>
            )}
          </Paper>
        )}
        {selectedArea && openSettingsPanel === null && (
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
              setOpenSettingsPanel(null);
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
          <Areas
            areas={visibleAreas}
            dashed
            fillColor={areaFillColor}
            fillOpacity={areaFillOpacity}
            outlineColor="black"
            outlineOpacity={0.6}
            style={areaLayerStyle}
          />
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
