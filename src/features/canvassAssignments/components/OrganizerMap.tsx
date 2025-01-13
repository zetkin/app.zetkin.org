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
import { Close, Layers, Search } from '@mui/icons-material';

import { ZetkinArea } from '../../areas/types';
import OrganizerMapRenderer from './OrganizerMapRenderer';
import { ZetkinPerson } from 'utils/types/zetkin';
import {
  ZetkinAssignmentAreaStats,
  ZetkinCanvassAssignment,
  ZetkinCanvassSession,
  ZetkinPlace,
} from '../types';
import objToLatLng from 'features/areas/utils/objToLatLng';
import { assigneesFilterContext } from './OrganizerMapFilters/AssigneeFilterContext';
import OrganizerMapFilters from './OrganizerMapFilters';
import OrganizerMapFilterBadge from './OrganizerMapFilters/OrganizerMapFilterBadge';
import AreaSelect from './AreaSelect';
import LayerSettings from './LayerSettings';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import MapControls from './MapControls';
import { areaFilterContext } from 'features/areas/components/AreaFilters/AreaFilterContext';
import theme from 'theme';

type OrganizerMapProps = {
  areaStats: ZetkinAssignmentAreaStats;
  areas: ZetkinArea[];
  assignment: ZetkinCanvassAssignment;
  canvassAssId: string;
  onAddAssigneeToArea: (area: ZetkinArea, person: ZetkinPerson) => void;
  places: ZetkinPlace[];
  sessions: ZetkinCanvassSession[];
};

export type MapStyle = {
  area: 'households' | 'progress' | 'hide' | 'assignees' | 'outlined';
  overlay: 'assignees' | 'households' | 'progress' | 'hide';
  place: 'dot' | 'households' | 'progress' | 'hide';
};

const OrganizerMap: FC<OrganizerMapProps> = ({
  areas,
  areaStats,
  assignment,
  canvassAssId,
  onAddAssigneeToArea,
  places,
  sessions,
}) => {
  const [mapStyle, setMapStyle] = useLocalStorage<MapStyle>(
    `mapStyle-${canvassAssId}`,
    {
      area: 'assignees',
      overlay: 'assignees',
      place: 'dot',
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
            const areaTitle = area.title || 'Untitled area';
            const areaDesc = area.description || 'Empty description';

            return (
              areaTitle.toLowerCase().includes(inputValue) ||
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
              <Search />
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
              paddingX: 2,
              paddingY: 1,
              position: 'absolute',
              right: '1rem',
              top: '1rem',
              zIndex: 1000,
            }}
          >
            {settingsOpen == 'select' && (
              <AreaSelect
                key={selectedArea?.id}
                areas={areas}
                canvassId={canvassAssId}
                filterAreas={filterAreas}
                filterText={filterText}
                onAddAssignee={(person) => {
                  if (selectedArea) {
                    onAddAssigneeToArea(selectedArea, person);
                  }
                }}
                onClose={clearAndCloseSettings}
                onFilterTextChange={(newValue) => setFilterText(newValue)}
                onSelectArea={(newValue) => setSelectedId(newValue)}
                places={places}
                selectedArea={selectedArea}
                selectedAreaStats={areaStats.stats.find(
                  (stat) => stat.areaId == selectedArea?.id
                )}
                sessions={sessions}
              />
            )}
            {settingsOpen != 'select' && (
              <>
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography variant="h5">
                    {settingsOpen == 'filters' ? 'Filters' : 'Map style'}
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
                  <LayerSettings
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
            areas={filteredAreas}
            areaStats={areaStats}
            areaStyle={mapStyle.area}
            assignment={assignment}
            canvassAssId={canvassAssId}
            onSelectedIdChange={(newId) => {
              setSelectedId(newId);

              if (!newId) {
                setSettingsOpen(null);
              } else {
                setSettingsOpen('select');
              }
            }}
            overlayStyle={mapStyle.overlay}
            places={places}
            placeStyle={mapStyle.place}
            selectedId={selectedId}
            sessions={sessions}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default OrganizerMap;
