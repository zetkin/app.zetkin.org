import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Box, Checkbox, Typography, useTheme } from '@mui/material';

import { ZetkinArea } from 'features/areas/types';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';
import FilterDropDown from '../FilterDropDown';
import { areaFilterContext } from './AreaFilterContext';
import AddFilterButton from './AddFilterButton';
import { useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';

type Props = {
  areas: ZetkinArea[];
  onFilteredIdsChange: (areaIds: number[]) => void;
};

const AreaFilters: FC<Props> = ({ areas, onFilteredIdsChange }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const [openDropdown, setOpenDropdown] = useState<'add' | number | null>(null);
  const {
    activeGroupIds,
    setActiveGroupIds,
    activeTagIdsByGroup,
    setActiveTagIdsByGroup,
  } = useContext(areaFilterContext);

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
    <>
      {activeGroupIds.map((groupId) => {
        const info = groupsById[groupId];
        const currentIds = activeTagIdsByGroup[groupId] || [];
        if (info) {
          return (
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
              label={
                info.group
                  ? info.group.title
                  : messages.areas.filter.ungroupedTagsLabel()
              }
              onToggle={(open) => setOpenDropdown(open ? groupId : null)}
              open={openDropdown == groupId}
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
          );
        }
      })}
      <AddFilterButton
        items={Object.values(groupsById).map((item) => {
          const groupId = item.group?.id ?? 0;
          const selected = activeGroupIds.includes(groupId);

          return {
            icon: <Checkbox checked={selected} />,
            label: item.group
              ? item.group.title
              : messages.areas.filter.ungroupedTagsLabel(),
            onClick: () => {
              if (selected) {
                setActiveGroupIds(activeGroupIds.filter((id) => groupId != id));
                const newValue = { ...activeTagIdsByGroup };
                delete newValue[groupId];
                setActiveTagIdsByGroup(newValue);
              } else {
                setActiveGroupIds([...activeGroupIds, groupId]);
                setOpenDropdown(groupId);
              }
            },
          };
        })}
        onToggle={(open) => setOpenDropdown(open ? 'add' : null)}
        open={openDropdown == 'add'}
      />
    </>
  );
};

export default AreaFilters;
