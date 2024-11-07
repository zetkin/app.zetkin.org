import { FC } from 'react';
import { ChevronLeft, Close, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  IconButton,
  lighten,
  TextField,
  Typography,
} from '@mui/material';

import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPerson from 'zui/ZUIPerson';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import { ZetkinArea } from 'features/areas/types';
import {
  ZetkinAssignmentAreaStatsItem,
  ZetkinCanvassSession,
  ZetkinPlace,
} from '../types';
import ZUIAvatar from 'zui/ZUIAvatar';
import isPointInsidePolygon from '../utils/isPointInsidePolygon';
import useCanvassSessionMutations from '../hooks/useCanvassSessionMutations';
import { useNumericRouteParams } from 'core/hooks';

type Props = {
  areas: ZetkinArea[];
  canvassId: string;
  filterAreas: (areas: ZetkinArea[], matchString: string) => ZetkinArea[];
  filterText: string;
  onAddAssignee: (person: ZetkinPerson) => void;
  onClose: () => void;
  onFilterTextChange: (newValue: string) => void;
  onSelectArea: (selectedId: string) => void;
  places: ZetkinPlace[];
  selectedArea?: ZetkinArea | null;
  selectedAreaStats?: ZetkinAssignmentAreaStatsItem;
  sessions: ZetkinCanvassSession[];
};

const AreaSelect: FC<Props> = ({
  areas,
  canvassId,
  filterAreas,
  filterText,
  onAddAssignee,
  onClose,
  onFilterTextChange,
  onSelectArea,
  places,
  selectedArea,
  selectedAreaStats,
  sessions,
}) => {
  const { orgId } = useNumericRouteParams();
  const { deleteAssignee } = useCanvassSessionMutations(orgId, canvassId);
  const selectedAreaAssignees = sessions
    .filter((session) => session.area.id == selectedArea?.id)
    .map((session) => session.assignee);

  const placesInSelectedArea: ZetkinPlace[] = [];
  if (selectedArea) {
    places.map((place) => {
      const isInsideArea = isPointInsidePolygon(
        place.position,
        selectedArea.points.map((point) => ({ lat: point[0], lng: point[1] }))
      );
      if (isInsideArea) {
        placesInSelectedArea.push(place);
      }
    });
  }

  const numberOfHouseholdsInSelectedArea = placesInSelectedArea
    .map((place) => place.households.length)
    .reduce((prev, curr) => prev + curr, 0);

  return (
    <>
      <Box paddingBottom={1}>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Box alignItems="center" display="flex">
            {selectedArea && (
              <IconButton onClick={() => onSelectArea('')}>
                <ChevronLeft />
              </IconButton>
            )}
            <Typography variant="h5">
              {selectedArea
                ? selectedArea?.title || 'Untitled area'
                : 'Find area'}
            </Typography>
          </Box>
          <IconButton onClick={() => onClose()}>
            <Close />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      {!selectedArea && (
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          overflow="hidden"
          paddingTop={1}
        >
          <TextField
            InputProps={{
              endAdornment: <Search color="secondary" />,
            }}
            onChange={(evt) => onFilterTextChange(evt.target.value)}
            placeholder="Filter"
            sx={{ paddingRight: 2 }}
            value={filterText}
            variant="outlined"
          />
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            paddingRight={2}
            sx={{ overflowY: 'auto' }}
          >
            {filterAreas(areas, filterText).map((area, index) => {
              const assignees = sessions
                .filter((session) => session.area.id == area.id)
                .map((session) => session.assignee);
              return (
                <>
                  {index != 0 && <Divider />}
                  <Box
                    key={area.id}
                    display="flex"
                    justifyContent="space-between"
                    onClick={() => onSelectArea(area.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Typography>{area.title || 'Untitled area'}</Typography>
                    <Box display="flex">
                      {assignees.map((assignee) => (
                        <ZUIAvatar
                          key={assignee.id}
                          size="sm"
                          url={`/api/orgs/${area.organization.id}/people/${assignee.id}/avatar`}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              );
            })}
          </Box>
        </Box>
      )}
      {selectedArea && (
        <Box display="flex" flexDirection="column" gap={1} paddingTop={1}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            {selectedAreaStats && (
              <>
                <Box alignItems="center" display="flex" flexDirection="column">
                  <Typography
                    sx={(theme) => ({ color: theme.palette.primary.main })}
                    variant="h5"
                  >
                    {selectedAreaStats.num_successful_visited_households}
                  </Typography>
                  <Typography textAlign="center">Successful visits</Typography>
                </Box>
                <Box alignItems="center" display="flex" flexDirection="column">
                  <Typography
                    sx={(theme) => ({
                      color: lighten(theme.palette.primary.main, 0.5),
                    })}
                    variant="h5"
                  >
                    {selectedAreaStats.num_visited_households}
                  </Typography>
                  <Typography textAlign="center">Visited households</Typography>
                </Box>
              </>
            )}
            <Box alignItems="center" display="flex" flexDirection="column">
              <Typography color="secondary" variant="h5">
                {numberOfHouseholdsInSelectedArea}
              </Typography>
              <Typography textAlign="center">Households</Typography>
            </Box>
            <Box alignItems="center" display="flex" flexDirection="column">
              <Typography color="secondary" variant="h5">
                {placesInSelectedArea.length}
              </Typography>
              <Typography textAlign="center">Places</Typography>
            </Box>
          </Box>
          <Typography
            fontStyle={
              selectedArea?.description?.trim().length ? 'inherit' : 'italic'
            }
            sx={{ overflowWrap: 'anywhere' }}
          >
            {selectedArea &&
              (selectedArea?.description?.trim() || 'Empty description')}
          </Typography>
          <Box>
            <Typography variant="h6">Assignees </Typography>
            {!selectedAreaAssignees.length && (
              <Typography
                color="secondary"
                fontStyle={
                  selectedArea.description?.trim().length ? 'inherit' : 'italic'
                }
                sx={{ overflowWrap: 'anywhere' }}
              >
                No assignees
              </Typography>
            )}
            {selectedAreaAssignees.map((assignee) => (
              <Box key={assignee.id} display="flex" my={1}>
                <ZUIPerson
                  id={assignee.id}
                  name={`${assignee.first_name} ${assignee.last_name}`}
                />
                <Button
                  color="secondary"
                  onClick={() => deleteAssignee(selectedArea.id, assignee.id)}
                >
                  <Close />
                </Button>
              </Box>
            ))}
            <Box mt={2}>
              <Typography variant="h6">Add assignee</Typography>
              <ZUIPersonSelect
                onChange={function (person: ZetkinPerson): void {
                  onAddAssignee(person);
                }}
                selectedPerson={null}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AreaSelect;
