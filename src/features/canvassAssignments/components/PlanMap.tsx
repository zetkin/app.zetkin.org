import { FC, useRef, useState } from 'react';
import { Map as MapType } from 'leaflet';
import { MapContainer } from 'react-leaflet';
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Chip,
  MenuItem,
  TextField,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

import { ZetkinArea } from '../../areas/types';
import PlanMapRenderer from './PlanMapRenderer';
import AreaPlanningOverlay from '../../areas/components/AreaPlanningOverlay';
import { ZetkinPerson } from 'utils/types/zetkin';
import { ZetkinCanvassSession } from '../types';

type PlanMapProps = {
  areas: ZetkinArea[];
  onAddAssigneeToArea: (area: ZetkinArea, person: ZetkinPerson) => void;
  sessions: ZetkinCanvassSession[];
};

const PlanMap: FC<PlanMapProps> = ({
  areas,
  onAddAssigneeToArea,
  sessions,
}) => {
  const [filterAssigned, setFilterAssigned] = useState(false);
  const [filterUnassigned, setFilterUnassigned] = useState(false);

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
          <ButtonGroup variant="contained">
            <Button onClick={() => mapRef.current?.zoomIn()}>
              <Add />
            </Button>
            <Button onClick={() => mapRef.current?.zoomOut()}>
              <Remove />
            </Button>
          </ButtonGroup>
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
            filterAssigned={filterAssigned}
            filterUnassigned={filterUnassigned}
            onSelectedIdChange={(newId) => setSelectedId(newId)}
            selectedId={selectedId}
            sessions={sessions}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default PlanMap;
