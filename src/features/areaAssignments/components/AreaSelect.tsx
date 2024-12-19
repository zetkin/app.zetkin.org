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
import { ZetkinArea } from 'features/geography/types';
import {
  ZetkinAssignmentAreaStatsItem,
  ZetkinAreaAssignmentSession,
  ZetkinLocation,
} from '../types';
import ZUIAvatar from 'zui/ZUIAvatar';
import isPointInsidePolygon from '../utils/isPointInsidePolygon';
import useAreaAssignmentSessionMutations from '../hooks/useAreaAssingmentSessionMutations';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';

type Props = {
  areaAssId: string;
  areas: ZetkinArea[];
  filterAreas: (areas: ZetkinArea[], matchString: string) => ZetkinArea[];
  filterText: string;
  locations: ZetkinLocation[];
  onAddAssignee: (person: ZetkinPerson) => void;
  onClose: () => void;
  onFilterTextChange: (newValue: string) => void;
  onSelectArea: (selectedId: string) => void;
  selectedArea?: ZetkinArea | null;
  selectedAreaStats?: ZetkinAssignmentAreaStatsItem;
  sessions: ZetkinAreaAssignmentSession[];
};

const AreaSelect: FC<Props> = ({
  areas,
  areaAssId,
  filterAreas,
  filterText,
  onAddAssignee,
  onClose,
  onFilterTextChange,
  onSelectArea,
  locations,
  selectedArea,
  selectedAreaStats,
  sessions,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { deleteSession } = useAreaAssignmentSessionMutations(orgId, areaAssId);
  const selectedAreaAssignees = sessions
    .filter((session) => session.area.id == selectedArea?.id)
    .map((session) => session.assignee);

  const locationsInSelectedArea: ZetkinLocation[] = [];
  if (selectedArea) {
    locations.map((location) => {
      const isInsideArea = isPointInsidePolygon(
        location.position,
        selectedArea.points.map((point) => ({ lat: point[0], lng: point[1] }))
      );
      if (isInsideArea) {
        locationsInSelectedArea.push(location);
      }
    });
  }

  const numberOfHouseholdsInSelectedArea = locationsInSelectedArea
    .map((location) => location.households.length)
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
              {selectedArea ? (
                selectedArea?.title || <Msg id={messageIds.default.title} />
              ) : (
                <Msg id={messageIds.map.findArea.title} />
              )}
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
            placeholder={messages.map.findArea.filterPlaceHolder()}
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
                    <Typography>
                      {area.title || <Msg id={messageIds.default.title} />}
                    </Typography>
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
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          paddingRight={2}
          paddingTop={1}
          sx={{ overflowY: 'auto' }}
        >
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
                  <Typography textAlign="center">
                    <Msg
                      id={messageIds.map.areaInfo.stats.successful}
                      values={{
                        numSuccessfulVisits:
                          selectedAreaStats.num_successful_visited_households,
                      }}
                    />
                  </Typography>
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
                  <Typography textAlign="center">
                    <Msg
                      id={messageIds.map.areaInfo.stats.visited}
                      values={{
                        numVisited: selectedAreaStats.num_visited_households,
                      }}
                    />
                  </Typography>
                </Box>
              </>
            )}
            <Box alignItems="center" display="flex" flexDirection="column">
              <Typography color="secondary" variant="h5">
                {numberOfHouseholdsInSelectedArea}
              </Typography>
              <Typography textAlign="center">
                <Msg
                  id={messageIds.map.areaInfo.stats.households}
                  values={{ numHouseholds: numberOfHouseholdsInSelectedArea }}
                />
              </Typography>
            </Box>
            <Box alignItems="center" display="flex" flexDirection="column">
              <Typography color="secondary" variant="h5">
                {locationsInSelectedArea.length}
              </Typography>
              <Typography textAlign="center">
                <Msg
                  id={messageIds.map.areaInfo.stats.locations}
                  values={{ numLocations: locationsInSelectedArea.length }}
                />
              </Typography>
            </Box>
          </Box>
          <Typography
            fontStyle={
              selectedArea?.description?.trim().length ? 'inherit' : 'italic'
            }
            sx={{ overflowWrap: 'anywhere' }}
          >
            {selectedArea &&
              (selectedArea?.description?.trim() || (
                <Msg id={messageIds.default.description} />
              ))}
          </Typography>
          <Box>
            <Typography variant="h6">
              <Msg id={messageIds.map.areaInfo.assignees.title} />
            </Typography>
            {!selectedAreaAssignees.length && (
              <Typography
                color="secondary"
                fontStyle={
                  selectedArea.description?.trim().length ? 'inherit' : 'italic'
                }
                sx={{ overflowWrap: 'anywhere' }}
              >
                <Msg id={messageIds.map.areaInfo.assignees.none} />
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
                  onClick={() => deleteSession(selectedArea.id, assignee.id)}
                >
                  <Close />
                </Button>
              </Box>
            ))}
            <Box mt={2}>
              <Typography variant="h6">
                <Msg id={messageIds.map.areaInfo.assignees.add} />
              </Typography>
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
