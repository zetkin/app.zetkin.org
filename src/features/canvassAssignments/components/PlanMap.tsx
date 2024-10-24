import { FC, useRef, useState } from 'react';
import { Map as MapType, latLngBounds } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { Autocomplete, Box, Chip, MenuItem, TextField } from '@mui/material';

import { ZetkinArea } from '../../areas/types';
import PlanMapRenderer from './PlanMapRenderer';
import AreaPlanningOverlay from '../../areas/components/AreaPlanningOverlay';
import { ZetkinPerson } from 'utils/types/zetkin';
import objToLatLng from 'features/areas/utils/objToLatLng';
import MapControls from './MapControls';
import {
  ZetkinAssignmentAreaStats,
  ZetkinCanvassSession,
  ZetkinPlace,
} from '../types';

type PlanMapProps = {
  areaStats: ZetkinAssignmentAreaStats;
  areas: ZetkinArea[];
  onAddAssigneeToArea: (area: ZetkinArea, person: ZetkinPerson) => void;
  places: ZetkinPlace[];
  sessions: ZetkinCanvassSession[];
};

const PlanMap: FC<PlanMapProps> = ({
  areas,
  areaStats,
  onAddAssigneeToArea,
  places,
  sessions,
}) => {
  const [filterAssigned, setFilterAssigned] = useState(false);
  const [filterUnassigned, setFilterUnassigned] = useState(false);
  const [locating, setLocating] = useState(false);

  const mapRef = useRef<MapType | null>(null);

  const [selectedId, setSelectedId] = useState('');
  const [filterText, setFilterText] = useState('');

  const selectedArea = areas.find((area) => area.id == selectedId);

  function filterAreas(areas: ZetkinArea[], matchString: string) {
    const inputValue = matchString.trim().toLowerCase();
    if (inputValue.length == 0) {
      return areas.concat();
    }

    return areas.filter((area) => {
      const areaTitle = area.title || 'Untitled area';
      const areaDesc = area.description || 'Empty description';

      return (
        areaTitle.toLowerCase().includes(inputValue) ||
        areaDesc.toLowerCase().includes(inputValue)
      );
    });
  }

  const zoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const zoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const fitBounds = () => {
    const map = mapRef.current;
    if (map) {
      if (areas.length) {
        const totalBounds = latLngBounds(
          areas[0].points.map((p) => objToLatLng(p))
        );

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
  };

  const onLocate = () => ({
    locating,
    setLocating,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          left: '1rem',
          position: 'absolute',
          right: '1rem',
          top: '1rem',
          zIndex: 999,
        }}
      >
        <Box alignItems="center" display="flex" gap={1}>
          <MapControls
            mapRef={mapRef}
            onFitBounds={fitBounds}
            onLocate={onLocate}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
          />
        </Box>
        <Box alignItems="center" display="flex" gap={1}>
          <Chip
            color={filterAssigned ? 'primary' : 'secondary'}
            label="Assigned"
            onClick={() => setFilterAssigned(!filterAssigned)}
          />
          <Chip
            color={filterUnassigned ? 'primary' : 'secondary'}
            label="Unassigned"
            onClick={() => setFilterUnassigned(!filterUnassigned)}
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
      <Box flexGrow={1} position="relative">
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
            areas={areas}
            areaStats={areaStats}
            filterAssigned={filterAssigned}
            filterUnassigned={filterUnassigned}
            onSelectedIdChange={(newId) => setSelectedId(newId)}
            places={places}
            selectedId={selectedId}
            sessions={sessions}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default PlanMap;
