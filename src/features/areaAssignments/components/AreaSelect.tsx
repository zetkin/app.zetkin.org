import { FC } from 'react';
import { ChevronLeft, ChevronRight, Close, Search } from '@mui/icons-material';
import { Box, Divider, IconButton, TextField, Typography } from '@mui/material';

import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPerson from 'zui/ZUIPerson';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';
import { ZetkinArea } from 'features/areas/types';
import {
  ZetkinAssignmentAreaStatsItem,
  ZetkinAreaAssignmentSession,
  ZetkinLocation,
} from '../types';
import ZUIAvatar from 'zui/ZUIAvatar';
import isPointInsidePolygon from '../../canvass/utils/isPointInsidePolygon';
import useAreaAssignmentSessionMutations from '../hooks/useAreaAssingmentSessionMutations';
import { useNumericRouteParams } from 'core/hooks';
import theme from 'theme';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { Msg, useMessages } from 'core/i18n';
import areaAssignmentMessageIds from '../l10n/messageIds';
import areasMessageIds from 'features/areas/l10n/messageIds';

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
  const areaAssignmentMessages = useMessages(areaAssignmentMessageIds);

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <Box>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Box alignItems="center" display="flex">
            {selectedArea && (
              <IconButton
                onClick={() => onSelectArea('')}
                sx={{ mr: 1, padding: 0 }}
              >
                <ChevronLeft />
              </IconButton>
            )}
            <Typography variant="h5">
              {selectedArea ? (
                selectedArea?.title || 'Untitled area'
              ) : (
                <Msg id={areaAssignmentMessageIds.map.findArea.title} />
              )}
            </Typography>
          </Box>
          <IconButton onClick={() => onClose()}>
            <Close />
          </IconButton>
        </Box>
        {selectedArea && (
          <Typography
            color="secondary"
            mb={1}
            sx={{ overflowWrap: 'anywhere' }}
          >
            {selectedArea.description?.trim() || (
              <Msg id={areasMessageIds.areas.default.description} />
            )}
          </Typography>
        )}
      </Box>
      <Divider />
      {!selectedArea && (
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          overflow="hidden"
          paddingTop={2}
        >
          <TextField
            InputProps={{
              endAdornment: <Search color="secondary" />,
            }}
            onChange={(evt) => onFilterTextChange(evt.target.value)}
            placeholder={areaAssignmentMessages.map.findArea.filterPlaceHolder()}
            size="small"
            value={filterText}
            variant="outlined"
          />
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
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
                    role="button"
                    sx={{
                      '&:hover': {
                        color: theme.palette.primary.main,
                      },
                      cursor: 'pointer',
                      pt: index == 0 ? 1 : 0,
                    }}
                  >
                    <Typography>{area.title || 'Untitled area'}</Typography>
                    <Box alignItems="center" display="flex">
                      {assignees.map((assignee, index) => {
                        if (index <= 3) {
                          return (
                            <Box key={assignee.id} marginX={0.2}>
                              <ZUIPersonHoverCard
                                key={assignee.id}
                                personId={assignee.id}
                              >
                                <ZUIAvatar
                                  key={assignee.id}
                                  size="sm"
                                  url={`/api/orgs/${area.organization.id}/people/${assignee.id}/avatar`}
                                />
                              </ZUIPersonHoverCard>
                            </Box>
                          );
                        } else if (index == 4) {
                          return (
                            <Box
                              alignItems="center"
                              bgcolor={theme.palette.grey[300]}
                              borderRadius="100%"
                              display="flex"
                              height="30px"
                              justifyContent="center"
                              padding={1}
                              width="30px"
                            >
                              <Typography color="secondary" fontSize={14}>{`+${
                                assignees.length - 4
                              }`}</Typography>
                            </Box>
                          );
                        } else {
                          return null;
                        }
                      })}
                      <Box ml={1}>
                        <ChevronRight />
                      </Box>
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
          paddingTop={1}
          sx={{ overflowY: 'auto' }}
        >
          <Box
            alignItems="start"
            display="flex"
            gap={2}
            justifyContent={selectedAreaStats ? 'space-between' : 'flex-start'}
          >
            {selectedAreaStats && (
              <Box alignItems="start" display="flex" flexDirection="column">
                <Typography
                  sx={(theme) => ({ color: theme.palette.primary.main })}
                  variant="h5"
                >
                  {selectedAreaStats.num_successful_visited_households}
                </Typography>
                <Typography
                  color="secondary"
                  textAlign="center"
                  variant="caption"
                >
                  <Msg
                    id={areaAssignmentMessageIds.map.areaInfo.stats.successful}
                    values={{
                      numSuccessfulVisits:
                        selectedAreaStats.num_successful_visited_households,
                    }}
                  />
                </Typography>
              </Box>
            )}
            <Box alignItems="start" display="flex" flexDirection="column">
              <Box display="flex">
                <Typography
                  color="secondary"
                  mr={0.5}
                  sx={(theme) => ({ color: theme.palette.primary.main })}
                  variant="h5"
                >
                  {selectedAreaStats?.num_visited_households || 0}
                </Typography>
                /
                <Typography color="secondary" ml={0.5} variant="h5">
                  {numberOfHouseholdsInSelectedArea}
                </Typography>
              </Box>
              <Typography
                color="secondary"
                textAlign="center"
                variant="caption"
              >
                <Msg
                  id={areaAssignmentMessageIds.map.areaInfo.stats.households}
                  values={{ numHouseholds: numberOfHouseholdsInSelectedArea }}
                />
              </Typography>
            </Box>
            <Box alignItems="start" display="flex" flexDirection="column">
              <Typography color="secondary" variant="h5">
                {locationsInSelectedArea.length}
              </Typography>
              <Typography
                color="secondary"
                textAlign="center"
                variant="caption"
              >
                <Msg
                  id={areaAssignmentMessageIds.map.areaInfo.stats.locations}
                  values={{ numLocations: locationsInSelectedArea.length }}
                />
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box mt={4}>
            <Typography variant="h6">
              <Msg id={areaAssignmentMessageIds.map.areaInfo.assignees.title} />
            </Typography>
            {!selectedAreaAssignees.length && (
              <Typography
                color="secondary"
                fontStyle={
                  selectedArea.description?.trim().length ? 'inherit' : 'italic'
                }
                sx={{ overflowWrap: 'anywhere' }}
              >
                <Msg
                  id={areaAssignmentMessageIds.map.areaInfo.assignees.none}
                />
              </Typography>
            )}
            {selectedAreaAssignees.map((assignee) => (
              <Box key={assignee.id} display="flex" my={1}>
                <ZUIPersonHoverCard personId={assignee.id}>
                  <ZUIPerson
                    id={assignee.id}
                    name={`${assignee.first_name} ${assignee.last_name}`}
                  />
                </ZUIPersonHoverCard>
                <IconButton
                  color="secondary"
                  onClick={() => deleteSession(selectedArea.id, assignee.id)}
                >
                  <Close />
                </IconButton>
              </Box>
            ))}
            <Box mt={2}>
              <Typography variant="h6">
                <Msg id={areaAssignmentMessageIds.map.areaInfo.assignees.add} />
              </Typography>
              <ZUIPersonSelect
                disabled
                getOptionDisabled={(person) =>
                  selectedAreaAssignees.some(
                    (assignee) => assignee.id == person.id
                  )
                }
                onChange={function (person: ZetkinPerson): void {
                  onAddAssignee(person);
                }}
                selectedPerson={null}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AreaSelect;
