import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useRef, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import {
  Add,
  Close,
  Create,
  GpsFixed,
  Home,
  Remove,
  Save,
} from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  MenuItem,
  TextField,
} from '@mui/material';
import { latLngBounds, Map as MapType } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useNumericRouteParams } from 'core/hooks';
import objToLatLng from 'features/areas/utils/objToLatLng';
import useCreateArea from '../../hooks/useCreateArea';
import { PointData, ZetkinArea } from '../../types';
import AreaFilters from '../AreaFilters';
import AreaOverlay from '../AreaOverlay';
import MapRenderer from './MapRenderer';
import AreaFilterProvider from '../AreaFilters/AreaFilterContext';
import AreaFilterButton from '../AreaFilters/AreaFilterButton';

interface MapProps {
  areas: ZetkinArea[];
}

const Map: FC<MapProps> = ({ areas }) => {
  const mapRef = useRef<MapType | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<PointData[] | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [filterText, setFilterText] = useState('');
  const [editingArea, setEditingArea] = useState<ZetkinArea | null>(null);
  const [filteredAreaIds, setFilteredAreaIds] = useState<null | string[]>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const selectedArea = areas.find((area) => area.id == selectedId) || null;

  const { orgId } = useNumericRouteParams();
  const createArea = useCreateArea(orgId);

  useEffect(() => {
    const map = mapRef.current;

    if (selectedArea && map) {
      const points = selectedArea.points.map((p) => objToLatLng(p));
      const areaBounds = latLngBounds(points);
      const topRightOnMap = areaBounds.getNorthEast();
      const container = map.getContainer();

      if (container && topRightOnMap) {
        const topRightInContainer = map.latLngToContainerPoint(topRightOnMap);

        const containerRect = container.getBoundingClientRect();
        const distanceFromRight = containerRect.width - topRightInContainer.x;
        if (distanceFromRight < 420) {
          const center = areaBounds.getCenter();
          map.panTo(center, { animate: true });
        }
      }
    }
  }, [selectedArea]);

  async function finishDrawing() {
    if (drawingPoints && drawingPoints.length > 2) {
      const area = await createArea({ points: drawingPoints });
      setSelectedId(area.id);
    }
    setDrawingPoints(null);
  }

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
              {!drawingPoints && (
                <Button
                  onClick={() => {
                    setDrawingPoints([]);
                  }}
                  startIcon={<Create />}
                >
                  Draw
                </Button>
              )}
              {drawingPoints && (
                <Button
                  onClick={() => {
                    setDrawingPoints(null);
                  }}
                  startIcon={<Close />}
                >
                  Cancel
                </Button>
              )}
              {drawingPoints && drawingPoints.length > 2 && (
                <Button
                  onClick={() => {
                    finishDrawing();
                  }}
                  startIcon={<Save />}
                >
                  Save
                </Button>
              )}
            </ButtonGroup>
          </Box>

          <Box alignItems="center" display="flex" gap={1}>
            <AreaFilterButton
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
        </Box>
        {filtersOpen && (
          <Box>
            <Divider />
            <Box display="flex" gap={1} justifyContent="start" px={2} py={1}>
              <AreaFilters
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
            <AreaOverlay
              area={editingArea || selectedArea}
              editing={!!editingArea}
              onBeginEdit={() => setEditingArea(selectedArea)}
              onCancelEdit={() => setEditingArea(null)}
              onClose={() => setSelectedId('')}
            />
          )}
          <MapContainer
            ref={mapRef}
            center={[0, 0]}
            style={{ height: '100%', width: '100%' }}
            zoom={2}
            zoomControl={false}
          >
            <MapRenderer
              areas={filteredAreas}
              drawingPoints={drawingPoints}
              editingArea={editingArea}
              onChangeArea={(area) => setEditingArea(area)}
              onChangeDrawingPoints={(points) => setDrawingPoints(points)}
              onFinishDrawing={() => finishDrawing()}
              onSelectArea={(area) => setSelectedId(area?.id ?? '')}
              selectedArea={selectedArea}
            />
          </MapContainer>
        </Box>
      </Box>
    </AreaFilterProvider>
  );
};

export default Map;
