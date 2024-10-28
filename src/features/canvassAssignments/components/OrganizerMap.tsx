import { FC, useRef, useState } from 'react';
import { latLngBounds, Map as MapType } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import {
  Box,
  Divider,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Close, Layers, Search } from '@mui/icons-material';

import { ZetkinArea } from '../../areas/types';
import OrganizerMapRenderer from './OrganizerMapRenderer';
import { ZetkinPerson } from 'utils/types/zetkin';
import {
  ZetkinAssignmentAreaStats,
  ZetkinCanvassSession,
  ZetkinPlace,
} from '../types';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import objToLatLng from 'features/areas/utils/objToLatLng';
import AssigneeFilterProvider from './OrganizerMapFilters/AssigneeFilterContext';
import OrganizerMapFilters from './OrganizerMapFilters';
import OrganizerMapFilterBadge from './OrganizerMapFilters/OrganizerMapFilterBadge';
import AreaSelect from './AreaSelect';
import LayerSettings from './LayerSettings';
import useLocalStorage from 'zui/hooks/useLocalStorage';
import MapControls from './MapControls';

type OrganizerMapProps = {
  areaStats: ZetkinAssignmentAreaStats;
  areas: ZetkinArea[];
  canvassAssId: string;
  onAddAssigneeToArea: (area: ZetkinArea, person: ZetkinPerson) => void;
  places: ZetkinPlace[];
  sessions: ZetkinCanvassSession[];
};

export type MapStyle = {
  area: 'households' | 'progress' | 'hide' | 'assignees';
  overlay: 'assignees' | 'households' | 'progress' | 'hide';
  place: 'dot' | 'households' | 'progress' | 'hide';
};

const OrganizerMap: FC<OrganizerMapProps> = ({
  areas,
  areaStats,
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
  const [locating, setLocating] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [filterText, setFilterText] = useState('');

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

  return (
    <AreaFilterProvider>
      <AssigneeFilterProvider>
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
              mapRef={mapRef}
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
              onLocate={() => ({
                locating,
                setLocating,
              })}
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
              <ToggleButtonGroup
                exclusive
                onChange={(ev, newValue) => {
                  setSettingsOpen(newValue);

                  if (!newValue) {
                    setSelectedId('');
                  }
                }}
                orientation="vertical"
                sx={(theme) => ({
                  backgroundColor: theme.palette.primary.main,
                })}
                value={settingsOpen}
              >
                <ToggleButton value="filters">
                  <OrganizerMapFilterBadge />
                </ToggleButton>
                <ToggleButton value="layers">
                  <Layers sx={{ color: 'white' }} />
                </ToggleButton>
                <ToggleButton value="select">
                  <Search sx={{ color: 'white' }} />
                </ToggleButton>
              </ToggleButtonGroup>
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
                  padding: 2,
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
                    filterAreas={filterAreas}
                    filterText={filterText}
                    onAddAssignee={(person) => {
                      if (selectedArea) {
                        onAddAssigneeToArea(selectedArea, person);
                      }
                    }}
                    onClose={() => {
                      setSelectedId('');
                      setSettingsOpen(null);
                    }}
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
                      paddingBottom={1}
                    >
                      <Typography variant="h5">
                        {settingsOpen == 'filters' ? 'Filters' : 'Layers'}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          setSettingsOpen(null);
                          setSelectedId('');
                        }}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                    <Divider />
                    {settingsOpen == 'layers' && (
                      <LayerSettings
                        mapStyle={mapStyle}
                        onMapStyleChange={(newMapStyle) =>
                          setMapStyle(newMapStyle)
                        }
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
      </AssigneeFilterProvider>
    </AreaFilterProvider>
  );
};

export default OrganizerMap;
