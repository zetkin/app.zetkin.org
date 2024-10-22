import { FC, useRef, useState } from 'react';
import { latLngBounds, Map as MapType } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Add, GpsFixed, Home, Remove } from '@mui/icons-material';

import { ZetkinArea } from '../../areas/types';
import PlanMapRenderer from './PlanMapRenderer';
import AreaPlanningOverlay from '../../areas/components/AreaPlanningOverlay';
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
import PlanMapFilterButton from './PlanMapFilters/PlanMapFilterButton';

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
  const [filtersOpen, setFiltersOpen] = useState(false);
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
          <Box
            alignItems="center"
            display="flex"
            gap={1}
            justifyContent="flex-end"
            paddingX={2}
            paddingY={1}
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
                <MenuItem value="households">Number of households</MenuItem>
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
                <MenuItem value="households">Number of households</MenuItem>
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
                <MenuItem value="households">Number of households</MenuItem>
                <MenuItem value="progress">
                  Progress (visited in this assignment)
                </MenuItem>
                <MenuItem value="hide">Hide</MenuItem>
              </Select>
            </FormControl>
            <PlanMapFilterButton
              onToggle={() => setFiltersOpen((current) => !current)}
            />
            <Autocomplete
              filterOptions={(options, state) =>
                filterAreas(options, state.inputValue)
              }
              getOptionLabel={(option) => option.id}
              inputValue={filterText}
              onChange={(ev, area) => {
                if (area) {
                  setSelectedId(area.id);
                  setFilterText('');
                }
              }}
              onInputChange={(ev, value, reason) => {
                if (reason == 'input') {
                  setFilterText(value);
                }
              }}
              options={areas}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ backgroundColor: 'white', width: '16rem' }}
                  variant="outlined"
                />
              )}
              renderOption={(props, area) => (
                <MenuItem {...props}>{area.title || 'Untitled area'}</MenuItem>
              )}
              value={null}
            />
          </Box>
          {filtersOpen && (
            <Box>
              <Divider />
              <Box display="flex" gap={1} justifyContent="start" px={2} py={1}>
                <PlanMapFilters
                  areas={areas}
                  onFilteredIdsChange={(areaIds) => {
                    setFilteredAreaIds(areaIds);
                  }}
                />
              </Box>
            </Box>
          )}
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
            {selectedArea && (
              <AreaPlanningOverlay
                key={selectedArea.id}
                area={selectedArea}
                assignees={sessions
                  .filter((session) => session.area.id == selectedArea.id)
                  .map((session) => session.assignee)}
                onAddAssignee={(person) => {
                  onAddAssigneeToArea(selectedArea, person);
                }}
                onClose={() => setSelectedId('')}
              />
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
                onSelectedIdChange={(newId) => setSelectedId(newId)}
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
