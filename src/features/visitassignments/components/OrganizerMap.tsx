import { FC, startTransition, useEffect, useRef, useState } from 'react';
import { latLngBounds, Map as MapType } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { useRouter } from 'next/router';
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
import { Close, FilterAlt, Layers, Pentagon } from '@mui/icons-material';

import { ZetkinArea } from '../../areas/types';
import OrganizerMapRenderer from 'features/visitassignments/components/OrganizerMapRenderer';
import flipForLeaflet from 'features/areas/utils/flipForLeaflet';
import MapStyleSettings from 'features/visitassignments/components/MapStyleSettings';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import MapControls from 'features/visitassignments/components/MapControls';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import messageIdsAss from '../l10n/messageIds';
import { useAutoResizeMap } from 'features/map/hooks/useResizeMap';
import { ZetkinPerson } from 'utils/types/zetkin';

type OrganizerMapProps = {
  areas: ZetkinArea[];
  targets: ZetkinPerson[];
  visitAssId: number;
};

export type MapStyle = {
  area: 'households' | 'progress' | 'hide' | 'assignees' | 'outlined';
  location: 'dot' | 'households' | 'progress' | 'hide';
  overlay: 'assignees' | 'households' | 'progress' | 'hide';
};

type SettingName = 'layers' | 'filters' | 'select';

const OrganizerMap: FC<OrganizerMapProps> = ({
  areas,
  visitAssId,
  targets,
}) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const [mapStyle, setMapStyle] = useLocalStorage<MapStyle>(
    `mapStyle-${visitAssId}`,
    {
      area: 'assignees',
      location: 'dot',
      overlay: 'assignees',
    }
  );

  const [settingsOpen, setSettingsOpen] = useState<SettingName | null>(null);
  const [selectedId, setSelectedId] = useState(0);
  const router = useRouter();
  const navigateToAreaId = parseInt(
    router.query.navigateToAreaId?.toString() ?? '0'
  );

  const mapRef = useRef<MapType | null>(null);
  useAutoResizeMap(mapRef.current);

  useEffect(() => {
    if (navigateToAreaId !== undefined && !Array.isArray(navigateToAreaId)) {
      setSelectedId(navigateToAreaId);
      setSettingsOpen('select');
    }
  }, [navigateToAreaId]);

  const clearAndCloseSettings = () => {
    startTransition(() => {
      setSettingsOpen(null);
      setSelectedId(0);
    });
  };

  const toggleSettings = (settingName: SettingName) => {
    if (settingsOpen === settingName) {
      clearAndCloseSettings();
    } else {
      startTransition(() => {
        setSettingsOpen(settingName);
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
      <Box flexGrow={1} position="relative" zIndex={0}>
        <MapControls
          map={mapRef.current}
          onFitBounds={() => {
            const map = mapRef.current;
            if (map) {
              if (areas.length) {
                // Start with first area
                const totalBounds = latLngBounds(
                  areas[0].points.map(flipForLeaflet)
                );

                // Extend with all areas
                areas.forEach((area) => {
                  const areaBounds = latLngBounds(
                    area.points.map(flipForLeaflet)
                  );
                  totalBounds.extend(areaBounds);
                });

                if (totalBounds) {
                  map.fitBounds(totalBounds, { animate: true });
                }
              }
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            transform: settingsOpen ? 'translate(-408px)' : '',
            zIndex: 999,
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
              title={messages.areas.controlLabels.filters()}
            >
              <Button
                onClick={() => {
                  if (settingsOpen == 'filters') {
                    clearAndCloseSettings();
                  } else {
                    startTransition(() => {
                      setSettingsOpen('filters');
                    });
                  }
                }}
              >
                <FilterAlt />
              </Button>
            </Tooltip>
            <Tooltip
              placement="left"
              title={messages.areas.controlLabels.layers()}
            >
              <Button onClick={() => toggleSettings('layers')}>
                <Layers />
              </Button>
            </Tooltip>
            <Tooltip
              placement="left"
              title={messages.areas.controlLabels.select()}
            >
              <Button
                onClick={() => {
                  if (settingsOpen == 'select') {
                    if (selectedId) {
                      startTransition(() => {
                        setSelectedId(0);
                      });
                    } else {
                      clearAndCloseSettings();
                    }
                  } else {
                    startTransition(() => {
                      setSettingsOpen('select');
                    });
                  }
                }}
              >
                <Pentagon />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>
        {settingsOpen && (
          <Paper
            sx={{
              bottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 400,
              minWidth: 400,
              overflow: 'hidden',
              paddingX: settingsOpen == 'select' ? 0 : 2,
              paddingY: 1,
              position: 'absolute',
              right: '1rem',
              top: '1rem',
              zIndex: 1000,
            }}
          >
            {settingsOpen == 'select' && (
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
                />
              </Box>
            )}
            {settingsOpen != 'select' && (
              <>
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography variant="h5">
                    {settingsOpen == 'filters' ? (
                      <Msg id={messageIdsAss.map.filter.header} />
                    ) : (
                      <Msg id={messageIdsAss.map.mapStyle.title} />
                    )}
                  </Typography>
                  <IconButton onClick={clearAndCloseSettings}>
                    <Close />
                  </IconButton>
                </Box>
                {settingsOpen == 'filters' && (
                  <Typography color="secondary" paddingBottom={1}>
                    <Msg id={messageIdsAss.map.filter.description} />
                  </Typography>
                )}
                <Divider />
                {settingsOpen == 'layers' && (
                  <MapStyleSettings
                    mapStyle={mapStyle}
                    onMapStyleChange={(newMapStyle) => setMapStyle(newMapStyle)}
                  />
                )}
              </>
            )}
          </Paper>
        )}
        <MapContainer
          ref={mapRef}
          attributionControl={false}
          center={[0, 0]}
          style={{ height: '100%', width: '100%' }}
          zoom={2}
          zoomControl={false}
        >
          <OrganizerMapRenderer
            areas={[]}
            areaStyle={mapStyle.area}
            locationStyle={mapStyle.location}
            onSelectedIdChange={() => {}}
            overlayStyle={mapStyle.overlay}
            selectedId={selectedId}
            targets={targets}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default OrganizerMap;
