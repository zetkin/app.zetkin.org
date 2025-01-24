import { FC, useContext, useEffect, useRef, useState } from 'react';
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
  Typography,
} from '@mui/material';
import { Close, Layers, Pentagon } from '@mui/icons-material';

import { ZetkinArea } from '../../areas/types';
import OrganizerMapRenderer from './OrganizerMapRenderer';
import { ZetkinPerson } from 'utils/types/zetkin';
import {
  ZetkinAssignmentAreaStats,
  ZetkinAreaAssignment,
  ZetkinAreaAssignmentSession,
  ZetkinLocation,
} from '../types';
import objToLatLng from 'features/areas/utils/objToLatLng';
import { assigneesFilterContext } from './OrganizerMapFilters/AssigneeFilterContext';
import OrganizerMapFilters from './OrganizerMapFilters';
import OrganizerMapFilterBadge from './OrganizerMapFilters/OrganizerMapFilterBadge';
import AreaSelect from './AreaSelect';
import MapStyleSettings from './MapStyleSettings';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import MapControls from './MapControls';
import { areaFilterContext } from 'features/areas/components/AreaFilters/AreaFilterContext';
import theme from 'theme';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import messageIdsAss from '../l10n/messageIds';

type OrganizerMapProps = {
  areaAssId: string;
  areaStats: ZetkinAssignmentAreaStats;
  areas: ZetkinArea[];
  assignment: ZetkinAreaAssignment;
  locations: ZetkinLocation[];
  onAddAssigneeToArea: (area: ZetkinArea, person: ZetkinPerson) => void;
  sessions: ZetkinAreaAssignmentSession[];
};

export type MapStyle = {
  area: 'households' | 'progress' | 'hide' | 'assignees' | 'outlined';
  location: 'dot' | 'households' | 'progress' | 'hide';
  overlay: 'assignees' | 'households' | 'progress' | 'hide';
};

const OrganizerMap: FC<OrganizerMapProps> = ({
  areas,
  areaStats,
  assignment,
  areaAssId,
  onAddAssigneeToArea,
  locations,
  sessions,
}) => {
  const messages = useMessages(messageIds);
  const [mapStyle, setMapStyle] = useLocalStorage<MapStyle>(
    `mapStyle-${areaAssId}`,
    {
      area: 'assignees',
      location: 'dot',
      overlay: 'assignees',
    }
  );

  const [settingsOpen, setSettingsOpen] = useState<
    ('layers' | 'filters' | 'select') | null
  >(null);
  const [filteredAreaIds, setFilteredAreaIds] = useState<null | string[]>(null);
  const [selectedId, setSelectedId] = useState('');
  const [filterText, setFilterText] = useState('');
  const { onAssigneesFilterChange } = useContext(assigneesFilterContext);
  const { setActiveGroupIds, setActiveTagIdsByGroup } =
    useContext(areaFilterContext);
  const router = useRouter();
  const { navigateToAreaId } = router.query;

  const mapRef = useRef<MapType | null>(null);

  const selectedArea = areas.find((area) => area.id == selectedId);

  function filterAreas(areas: ZetkinArea[], matchString: string) {
    const inputValue = matchString.trim().toLowerCase();

    const afterTextFilter =
      inputValue.length == 0
        ? areas.concat()
        : areas.filter((area) => {
            const areaDesc =
              area.description || messages.areas.default.description();

            return (
              area.title.toLowerCase().includes(inputValue) ||
              areaDesc.toLowerCase().includes(inputValue)
            );
          });

    const afterComplexFilter =
      filteredAreaIds == null
        ? afterTextFilter
        : afterTextFilter.filter((area) => filteredAreaIds.includes(area.id));

    return afterComplexFilter;
  }

  const filteredAreas = filterAreas(areas, filterText);

  useEffect(() => {
    if (navigateToAreaId !== undefined && !Array.isArray(navigateToAreaId)) {
      setSelectedId(navigateToAreaId);
      setSettingsOpen('select');
    }
  }, [navigateToAreaId]);

  const clearAndCloseSettings = () => {
    setSettingsOpen(null);
    setSelectedId('');
    onAssigneesFilterChange(null);
    setFilteredAreaIds(null);
    setActiveGroupIds([]);
    setActiveTagIdsByGroup({});
    setFilterText('');
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
      <Box flexGrow={1} position="relative">
        <MapControls
          map={mapRef.current}
          onFitBounds={() => {
            const map = mapRef.current;
            if (map) {
              if (areas.length) {
                // Start with first area
                const totalBounds = latLngBounds(
                  areas[0].points.map((p) => objToLatLng(p))
                );

                // Extend with all areas
                areas.forEach((area) => {
                  const areaBounds = latLngBounds(
                    area.points.map((p) => objToLatLng(p))
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
            <Button
              onClick={() => {
                if (settingsOpen == 'filters') {
                  clearAndCloseSettings();
                } else {
                  setSettingsOpen('filters');
                }
              }}
            >
              <OrganizerMapFilterBadge />
            </Button>
            <Button
              onClick={() => {
                if (settingsOpen == 'layers') {
                  clearAndCloseSettings();
                } else {
                  setSettingsOpen('layers');
                }
              }}
            >
              <Layers />
            </Button>
            <Button
              onClick={() => {
                if (settingsOpen == 'select') {
                  if (selectedId) {
                    setSelectedId('');
                  } else {
                    clearAndCloseSettings();
                  }
                } else {
                  setSettingsOpen('select');
                }
              }}
            >
              <Pentagon />
            </Button>
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
                  height: '80vh',
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    paddingX: 2,
                  }}
                >
                  <AreaSelect
                    key={selectedArea?.id}
                    areaAssId={areaAssId}
                    areas={areas}
                    filterAreas={filterAreas}
                    filterText={filterText}
                    locations={locations}
                    onAddAssignee={(person) => {
                      if (selectedArea) {
                        onAddAssigneeToArea(selectedArea, person);
                      }
                    }}
                    onClose={clearAndCloseSettings}
                    onFilterTextChange={(newValue) => setFilterText(newValue)}
                    onSelectArea={(newValue) => setSelectedId(newValue)}
                    selectedArea={selectedArea}
                    selectedAreaStats={areaStats.stats.find(
                      (stat) => stat.areaId == selectedArea?.id
                    )}
                    sessions={sessions}
                  />
                </Box>
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
                    Define what areas you see on the map
                  </Typography>
                )}
                <Divider />
                {settingsOpen == 'layers' && (
                  <MapStyleSettings
                    mapStyle={mapStyle}
                    onMapStyleChange={(newMapStyle) => setMapStyle(newMapStyle)}
                  />
                )}
                {settingsOpen == 'filters' && (
                  <OrganizerMapFilters
                    areas={areas}
                    onFilteredIdsChange={(areaIds) => {
                      setFilteredAreaIds(areaIds);
                    }}
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
            areaAssId={areaAssId}
            areas={filteredAreas}
            areaStats={areaStats}
            areaStyle={mapStyle.area}
            assignment={assignment}
            locations={locations}
            locationStyle={mapStyle.location}
            onSelectedIdChange={(newId: string) => {
              setSelectedId(newId);

              if (!newId) {
                setSettingsOpen(null);
              } else {
                setSettingsOpen('select');
              }
            }}
            overlayStyle={mapStyle.overlay}
            selectedId={selectedId}
            sessions={sessions}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default OrganizerMap;
