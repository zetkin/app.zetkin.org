import { FC, Suspense } from 'react';
import { ChevronLeft, ChevronRight, Close, Search } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import { ZetkinArea } from 'features/areas/types';
import {
  ZetkinAssignmentAreaStatsItem,
  ZetkinAreaAssignee,
  ZetkinLocation,
} from '../types';
import ZUIAvatar from 'zui/ZUIAvatar';
import isPointInsidePolygon from '../../canvass/utils/isPointInsidePolygon';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';
import areaAssignmentMessageIds from '../l10n/messageIds';
import areasMessageIds from 'features/areas/l10n/messageIds';
import { ZUIExpandableText } from 'zui/ZUIExpandableText';
import locToLatLng from 'features/geography/utils/locToLatLng';
import UserAutocomplete from 'features/user/components/UserAutocomplete';
import { ZetkinOrgUser } from 'features/user/types';
import useAreaAssignmentMutations from '../hooks/useAreaAssignmentMutations';
import UserItem from 'features/user/components/UserItem';

type Props = {
  areaAssId: number;
  areas: ZetkinArea[];
  filterAreas: (areas: ZetkinArea[], matchString: string) => ZetkinArea[];
  filterText: string;
  locations: ZetkinLocation[];
  onAddAssignee: (user: ZetkinOrgUser) => void;
  onClose: () => void;
  onFilterTextChange: (newValue: string) => void;
  onSelectArea: (selectedId: number) => void;
  selectedArea?: ZetkinArea | null;
  selectedAreaStats?: ZetkinAssignmentAreaStatsItem;
  sessions: ZetkinAreaAssignee[];
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
  const areaMessages = useMessages(areasMessageIds);
  const theme = useTheme();

  const { orgId } = useNumericRouteParams();
  const { unassignArea } = useAreaAssignmentMutations(orgId, areaAssId);
  const selectedAreaAssignees = sessions
    .filter((session) => session.area_id == selectedArea?.id)
    .map((session) => session.user_id);

  const locationsInSelectedArea: ZetkinLocation[] = [];
  if (selectedArea) {
    const points = selectedArea.boundary.coordinates[0] || [];
    locations.map((location) => {
      const isInsideArea = isPointInsidePolygon(
        locToLatLng(location),
        points.map((point) => ({ lat: point[0], lng: point[1] }))
      );
      if (isInsideArea) {
        locationsInSelectedArea.push(location);
      }
    });
  }

  const numberOfHouseholdsInSelectedArea = locationsInSelectedArea
    .map(
      (location) =>
        location.num_known_households || location.num_estimated_households
    )
    .reduce((prev, curr) => prev + curr, 0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Box alignItems="center" display="flex">
            {selectedArea && (
              <IconButton
                onClick={() => onSelectArea(0)}
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
            <ZUIExpandableText
              content={
                selectedArea.description?.trim() ||
                areaMessages.areas.default.description()
              }
              maxVisibleChars={110}
            />
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
                .filter((session) => session.area_id == area.id)
                .map((session) => session.user_id);
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
                      {assignees.map((user_id, index) => {
                        if (index <= 3) {
                          return (
                            <Box key={user_id} marginX={0.2}>
                              <ZUIAvatar
                                key={user_id}
                                size="sm"
                                url={`/api/users/${user_id}/avatar`}
                              />
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
          {selectedAreaStats && (
            <Box
              alignItems="start"
              display="flex"
              flexDirection="column"
              gap={1}
            >
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
          <Box alignItems="start" display="flex" flexDirection="column" gap={1}>
            <Box alignItems="center" display="flex">
              <Typography
                color="secondary"
                sx={(theme) => ({ color: theme.palette.primary.main })}
                variant="h5"
              >
                {selectedAreaStats?.num_visited_households || 0}
              </Typography>
              <Typography color="secondary" ml={0.5} variant="h5">
                / {numberOfHouseholdsInSelectedArea}
              </Typography>
            </Box>
            <Typography color="secondary" textAlign="center" variant="caption">
              <Msg
                id={areaAssignmentMessageIds.map.areaInfo.stats.households}
                values={{ numHouseholds: numberOfHouseholdsInSelectedArea }}
              />
            </Typography>
          </Box>
          <Box alignItems="start" display="flex" flexDirection="column" gap={1}>
            <Typography color="secondary" variant="h5">
              {locationsInSelectedArea.length}
            </Typography>
            <Typography color="secondary" textAlign="center" variant="caption">
              <Msg
                id={areaAssignmentMessageIds.map.areaInfo.stats.locations}
                values={{ numLocations: locationsInSelectedArea.length }}
              />
            </Typography>
          </Box>
          <Divider />
          <Box mt={2}>
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
            <Suspense
              fallback={
                <Box m={2}>
                  <CircularProgress size={20} />
                </Box>
              }
            >
              {selectedAreaAssignees.map((userId) => (
                <Box
                  key={userId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    my: 1,
                  }}
                >
                  <UserItem orgId={orgId} userId={userId} />
                  <IconButton
                    color="secondary"
                    onClick={() => unassignArea(userId, selectedArea.id)}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ))}
            </Suspense>
            <Box mt={2}>
              <Typography variant="h6">
                <Msg id={areaAssignmentMessageIds.map.areaInfo.assignees.add} />
              </Typography>
              <UserAutocomplete
                onSelect={(user) => {
                  if (user) {
                    onAddAssignee(user);
                  }
                }}
                orgId={orgId}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AreaSelect;
