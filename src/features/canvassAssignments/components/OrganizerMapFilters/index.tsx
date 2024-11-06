import { Close } from '@mui/icons-material';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';

import { ZetkinArea } from 'features/areas/types';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';
import { areaFilterContext } from 'features/areas/components/AreaFilters/AreaFilterContext';
import AddFilterButton from 'features/areas/components/AreaFilters/AddFilterButton';
import FilterDropDown from 'features/areas/components/FilterDropDown';
import { assigneesFilterContext } from './AssigneeFilterContext';

type Props = {
  areas: ZetkinArea[];
  onFilteredIdsChange: (areaIds: string[]) => void;
};

const OrganizerMapFilters: FC<Props> = ({ areas, onFilteredIdsChange }) => {
  const theme = useTheme();
  const [openTagsDropdown, setOpenTagsDropdown] = useState<
    'add' | number | null
  >(null);
  const [openAssigneesDropdown, setOpenAssigneesDropdown] = useState(false);

  const {
    activeGroupIds,
    setActiveGroupIds,
    activeTagIdsByGroup,
    setActiveTagIdsByGroup,
  } = useContext(areaFilterContext);

  const { assigneesFilter, onAssigneesFilterChange } = useContext(
    assigneesFilterContext
  );

  const groupsById = useMemo(() => {
    const groupsById: Record<
      number,
      { group: ZetkinTagGroup | null; tags: ZetkinTag[] }
    > = {};

    areas.forEach((area) => {
      area.tags.forEach((tag) => {
        const groupId = tag.group?.id ?? 0;
        if (!groupsById[groupId]) {
          groupsById[groupId] = {
            group: tag.group,
            tags: [tag],
          };
        } else {
          const alreadyAdded = groupsById[groupId].tags.some(
            (oldTag) => oldTag.id == tag.id
          );
          if (!alreadyAdded) {
            groupsById[groupId].tags.push(tag);
          }
        }
      });
    });

    return groupsById;
  }, [areas]);

  useEffect(() => {
    const filteredAreas = areas.filter((area) => {
      // All selected groups must match (boolean AND)
      return Object.values(activeTagIdsByGroup).every((idsInGroup) => {
        // A group matches if ANY of the tags match (boolean OR) or if
        // there are no tags in the group which indicates that the filter
        // has not yet been configured
        const areaTagIds = area.tags.map((tag) => tag.id);
        return (
          idsInGroup.length == 0 ||
          idsInGroup.some((id) => areaTagIds.includes(id))
        );
      });
    });

    onFilteredIdsChange(filteredAreas.map((area) => area.id));
  }, [activeGroupIds, activeTagIdsByGroup]);

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box paddingTop={1}>
        <Typography>
          Add filters to decide what areas you see on the map.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" flexGrow={1} gap={1}>
        <AddFilterButton
          items={Object.values(groupsById).map((item) => {
            const groupId = item.group?.id ?? 0;
            const selected = activeGroupIds.includes(groupId);

            return {
              icon: <Checkbox checked={selected} />,
              label: item.group ? item.group.title : 'Ungrouped tags',
              onClick: () => {
                if (selected) {
                  setActiveGroupIds(
                    activeGroupIds.filter((id) => groupId != id)
                  );
                  const newValue = { ...activeTagIdsByGroup };
                  delete newValue[groupId];
                  setActiveTagIdsByGroup(newValue);
                } else {
                  setActiveGroupIds([...activeGroupIds, groupId]);
                  setOpenTagsDropdown(groupId);
                }
              },
            };
          })}
          onToggle={(open) => setOpenTagsDropdown(open ? 'add' : null)}
          open={openTagsDropdown == 'add'}
        />
        <Box alignItems="center" display="flex">
          <FilterDropDown
            items={[
              {
                icon: <Checkbox checked={assigneesFilter == 'assigned'} />,
                label: 'Only assigned areas',
                onClick: () => {
                  if (!assigneesFilter || assigneesFilter == 'unassigned') {
                    onAssigneesFilterChange('assigned');
                  } else {
                    onAssigneesFilterChange(null);
                  }
                },
              },
              {
                icon: <Checkbox checked={assigneesFilter == 'unassigned'} />,
                label: 'Only unassigned areas',
                onClick: () => {
                  if (!assigneesFilter || assigneesFilter == 'assigned') {
                    onAssigneesFilterChange('unassigned');
                  } else {
                    onAssigneesFilterChange(null);
                  }
                },
              },
            ]}
            label="Assignees"
            onToggle={() => setOpenAssigneesDropdown(!openAssigneesDropdown)}
            open={openAssigneesDropdown}
            startIcon={
              assigneesFilter ? (
                <Box
                  sx={{
                    // TODO: Use ZUI for this
                    alignItems: 'center',
                    aspectRatio: '1/1',
                    backgroundColor: theme.palette.primary.light,
                    borderRadius: '50%',
                    color: theme.palette.primary.contrastText,
                    display: 'flex',
                    height: '1.2em',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      margin: 0,
                    }}
                  >
                    {1}
                  </Typography>
                </Box>
              ) : null
            }
            variant="outlined"
          />
          <IconButton
            onClick={() => {
              onAssigneesFilterChange(null);
            }}
          >
            <Close />
          </IconButton>
        </Box>
        {activeGroupIds.map((groupId) => {
          const info = groupsById[groupId];
          const currentIds = activeTagIdsByGroup[groupId] || [];
          if (info) {
            return (
              <Box key={groupId} alignItems="center" display="flex">
                <FilterDropDown
                  items={info.tags.map((tag) => {
                    const selected = currentIds.includes(tag.id) ?? false;

                    return {
                      icon: <Checkbox checked={selected} />,
                      label: tag.title,
                      onClick: () => {
                        setActiveTagIdsByGroup({
                          ...activeTagIdsByGroup,
                          [groupId]: selected
                            ? currentIds.filter((id) => tag.id != id)
                            : [...currentIds, tag.id],
                        });
                      },
                    };
                  })}
                  label={info.group ? info.group.title : 'Ungrouped tags'}
                  onToggle={(open) =>
                    setOpenTagsDropdown(open ? groupId : null)
                  }
                  open={openTagsDropdown == groupId}
                  startIcon={
                    currentIds.length > 0 ? (
                      <Box
                        sx={{
                          // TODO: Use ZUI for this
                          alignItems: 'center',
                          aspectRatio: '1/1',
                          backgroundColor: theme.palette.primary.light,
                          borderRadius: '50%',
                          color: theme.palette.primary.contrastText,
                          display: 'flex',
                          height: '1.2em',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            margin: 0,
                          }}
                        >
                          {currentIds.length}
                        </Typography>
                      </Box>
                    ) : null
                  }
                  variant="outlined"
                />
                <IconButton
                  onClick={() => {
                    setActiveGroupIds(
                      activeGroupIds.filter((id) => groupId != id)
                    );
                    const newValue = { ...activeTagIdsByGroup };
                    delete newValue[groupId];
                    setActiveTagIdsByGroup(newValue);
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            );
          }
        })}
      </Box>
    </Box>
  );
};

export default OrganizerMapFilters;
