import 'leaflet/dist/leaflet.css';
import { FC, useRef, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  TextField,
} from '@mui/material';
import { Add, Close, Create, Remove, Save } from '@mui/icons-material';
import { Map as MapType } from 'leaflet';

import { PointData, ZetkinArea } from '../../types';
import useCreateArea from '../../hooks/useCreateArea';
import { useNumericRouteParams } from 'core/hooks';
import AreaOverlay from '../AreaOverlay';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../../l10n/messageIds';
import MapRenderer from './MapRenderer';

interface MapProps {
  areas: ZetkinArea[];
}

const Map: FC<MapProps> = ({ areas }) => {
  const messages = useMessages(messageIds);
  const mapRef = useRef<MapType | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<PointData[] | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [filterText, setFilterText] = useState('');
  const [editingArea, setEditingArea] = useState<ZetkinArea | null>(null);

  const selectedArea = areas.find((area) => area.id == selectedId);

  const { orgId } = useNumericRouteParams();
  const createArea = useCreateArea(orgId);

  async function finishDrawing() {
    if (drawingPoints && drawingPoints.length > 2) {
      const area = await createArea({ points: drawingPoints });
      setSelectedId(area.id);
    }
    setDrawingPoints(null);
  }

  function filterAreas(areas: ZetkinArea[], matchString: string) {
    const inputValue = matchString.trim().toLowerCase();
    if (inputValue.length == 0) {
      return areas.concat();
    }

    return areas.filter((area) => {
      const areaTitle = area.title || messages.empty.title();
      const areaDesc = area.description || messages.empty.description();

      return (
        areaTitle.toLowerCase().includes(inputValue) ||
        areaDesc.toLowerCase().includes(inputValue)
      );
    });
  }

  const filteredAreas = filterAreas(areas, filterText);

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

          <ButtonGroup variant="contained">
            {!drawingPoints && (
              <Button
                onClick={() => {
                  setDrawingPoints([]);
                }}
                startIcon={<Create />}
              >
                <Msg id={messageIds.tools.draw} />
              </Button>
            )}
            {drawingPoints && (
              <Button
                onClick={() => {
                  setDrawingPoints(null);
                }}
                startIcon={<Close />}
              >
                <Msg id={messageIds.tools.cancel} />
              </Button>
            )}
            {drawingPoints && drawingPoints.length > 2 && (
              <Button
                onClick={() => {
                  finishDrawing();
                }}
                startIcon={<Save />}
              >
                <Msg id={messageIds.tools.save} />
              </Button>
            )}
          </ButtonGroup>
        </Box>

        <Box>
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
              <MenuItem {...props}>
                {area.title || messages.empty.title()}
              </MenuItem>
            )}
            value={null}
          />
        </Box>
      </Box>

      <Box flexGrow={1} position="relative">
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
            onSelectArea={(area) => setSelectedId(area.id)}
            selectedId={selectedId}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default Map;
