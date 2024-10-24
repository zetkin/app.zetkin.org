import { FC, useRef, useState } from 'react';
import { latLngBounds, Map as MapType } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  Add,
  Close,
  GpsFixed,
  Home,
  Layers,
  Remove,
  Search,
} from '@mui/icons-material';

import { ZetkinArea } from '../../areas/types';
import PlanMapRenderer from './PlanMapRenderer';
import { ZetkinPerson } from 'utils/types/zetkin';
import {
  ZetkinAssignmentAreaStats,
  ZetkinCanvassSession,
  ZetkinPlace,
} from '../types';
import AreaFilterProvider from 'features/areas/components/AreaFilters/AreaFilterContext';
import objToLatLng from 'features/areas/utils/objToLatLng';
import AssigneeFilterProvider from './PlanMapFilters/AssigneeFilterContext';
import PlanMapFilters from './PlanMapFilters';
import PlanMapFilterBadge from './PlanMapFilters/PlanMapFilterButton';
import AreaSelect from './AreaSelect';

type PlanMapProps = {
  areaStats: ZetkinAssignmentAreaStats;
  areas: ZetkinArea[];
  canvassAssId: string;
  onAddAssigneeToArea: (area: ZetkinArea, person: ZetkinPerson) => void;
  places: ZetkinPlace[];
  sessions: ZetkinCanvassSession[];
};

const PlanMap: FC<PlanMapProps> = ({
  areas,
  areaStats,
  canvassAssId,
  onAddAssigneeToArea,
  places,
  sessions,
}) => {
  const [settingsOpen, setSettingsOpen] = useState<
    ('layers' | 'filters' | 'select') | null
  >(null);
  const [filteredAreaIds, setFilteredAreaIds] = useState<null | string[]>(null);
  const [placeStyle, setPlaceStyle] = useState<
    'dot' | 'households' | 'progress' | 'hide'
  >('dot');
  const [areaStyle, setAreaStyle] = useState<
    'households' | 'progress' | 'hide' | 'default'
  >('default');
  const [overlayStyle, setOverlayStyle] = useState<
    'assignees' | 'households' | 'progress' | 'hide'
  >('assignees');
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
            <Box
              sx={{
                left: 16,
                position: 'absolute',
                top: 16,
                zIndex: 999,
              }}
            >
              <ButtonGroup orientation="vertical" variant="contained">
                <Button onClick={() => mapRef.current?.zoomIn()}>
                  <Add />
                </Button>
                <Button onClick={() => mapRef.current?.zoomOut()}>
                  <Remove />
                </Button>
                <Button
                  onClick={() => {
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
                >
                  <Home />
                </Button>
                <Button
                  onClick={() => {
                    setLocating(true);
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setLocating(false);

                        const zoom = 16;
                        const latLng = {
                          lat: pos.coords.latitude,
                          lng: pos.coords.longitude,
                        };

                        mapRef.current?.flyTo(latLng, zoom, {
                          animate: true,
                          duration: 0.8,
                        });
                      },
                      () => {
                        // When an error occurs just stop the loading indicator
                        setLocating(false);
                      },
                      { enableHighAccuracy: true, timeout: 5000 }
                    );
                  }}
                >
                  {locating ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    <GpsFixed />
                  )}
                </Button>
              </ButtonGroup>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                transform:
                  settingsOpen || selectedArea ? 'translate(-408px)' : '',
                zIndex: 999,
              }}
            >
              <ToggleButtonGroup
                exclusive
                onChange={(ev, newValue) => {
                  setSettingsOpen(newValue);
                  if (selectedArea) {
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
                  <PlanMapFilterBadge />
                </ToggleButton>
                <ToggleButton value="layers">
                  <Layers sx={{ color: 'white' }} />
                </ToggleButton>
                <ToggleButton value="select">
                  <Search sx={{ color: 'white' }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {(settingsOpen == 'select' || selectedArea) && (
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
                  selectedArea={selectedArea}
                  sessions={sessions}
                />
              </Paper>
            )}
            {settingsOpen == 'layers' && !selectedArea && (
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
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                  paddingBottom={1}
                >
                  <Typography variant="h5">Layers</Typography>
                  <IconButton onClick={() => setSettingsOpen(null)}>
                    <Close />
                  </IconButton>
                </Box>
                <Divider />
                Map layers
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  paddingTop={1}
                >
                  <FormControl variant="outlined">
                    <InputLabel id="place-style-label">Place</InputLabel>
                    <Select
                      label="Place"
                      labelId="place-style-label"
                      onChange={(ev) => {
                        const newValue = ev.target.value;
                        if (
                          newValue == 'dot' ||
                          newValue == 'households' ||
                          newValue == 'progress' ||
                          newValue == 'hide'
                        ) {
                          setPlaceStyle(newValue);
                        }
                      }}
                      sx={{ backgroundColor: 'white', width: '10rem' }}
                      value={placeStyle}
                    >
                      <MenuItem value="dot">Dot</MenuItem>
                      <MenuItem value="households">
                        Number of households
                      </MenuItem>
                      <MenuItem value="progress">
                        Progress (visited in this assignment)
                      </MenuItem>
                      <MenuItem value="hide">Hide</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel id="area-style-label">Area</InputLabel>
                    <Select
                      label="Area"
                      labelId="area-style-color"
                      onChange={(ev) => {
                        const newValue = ev.target.value;
                        if (
                          newValue == 'households' ||
                          newValue == 'progress' ||
                          newValue == 'hide' ||
                          newValue == 'default'
                        ) {
                          setAreaStyle(newValue);
                        }
                      }}
                      sx={{ backgroundColor: 'white', width: '10rem' }}
                      value={areaStyle}
                    >
                      <MenuItem value="default">Default</MenuItem>
                      <MenuItem value="households">
                        Number of households
                      </MenuItem>
                      <MenuItem value="progress">
                        Progress (visited in this assignment)
                      </MenuItem>
                      <MenuItem value="hide">Hide</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel id="overlay-style-label">Overlay</InputLabel>
                    <Select
                      label="Overlay"
                      labelId="overlay-style-label"
                      onChange={(ev) => {
                        const newValue = ev.target.value;
                        if (
                          newValue == 'assignees' ||
                          newValue == 'households' ||
                          newValue == 'progress' ||
                          newValue == 'hide'
                        ) {
                          setOverlayStyle(newValue);
                        }
                      }}
                      sx={{ backgroundColor: 'white', width: '10rem' }}
                      value={overlayStyle}
                    >
                      <MenuItem value="assignees">Assignees</MenuItem>
                      <MenuItem value="households">
                        Number of households
                      </MenuItem>
                      <MenuItem value="progress">
                        Progress (visited in this assignment)
                      </MenuItem>
                      <MenuItem value="hide">Hide</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            )}
            {settingsOpen == 'filters' && !selectedArea && (
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
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                  paddingBottom={1}
                >
                  <Typography variant="h5">Filters</Typography>
                  <IconButton onClick={() => setSettingsOpen(null)}>
                    <Close />
                  </IconButton>
                </Box>
                <Divider />
                Filters
                <PlanMapFilters
                  areas={areas}
                  onFilteredIdsChange={(areaIds) => {
                    setFilteredAreaIds(areaIds);
                  }}
                />
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
              <PlanMapRenderer
                areas={filteredAreas}
                areaStats={areaStats}
                areaStyle={areaStyle}
                canvassAssId={canvassAssId}
                onSelectedIdChange={(newId) => {
                  setSettingsOpen('select');
                  setSelectedId(newId);
                }}
                overlayStyle={overlayStyle}
                places={places}
                placeStyle={placeStyle}
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

export default PlanMap;
