import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, Divider, IconButton } from '@mui/material';
import { FC, useState } from 'react';

import { HouseholdItem } from './types';
import HouseholdStack from './HouseholdStack';

type Props = {
  floor: number;
  householdItems: HouseholdItem[];
  onClick: (householdId: number) => void;
  onClickVisit: (householdId: number) => void;
  onDeselectIds: (ids: number[]) => void;
  onSelectIds: (ids: number[]) => void;
  selectedIds: null | number[];
};

const FloorHouseholdGroup: FC<Props> = ({
  floor,
  householdItems,
  onClick,
  onClickVisit,
  onSelectIds,
  onDeselectIds,
  selectedIds,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        height: expanded ? 54 + householdItems.length * 54 : 54,
        position: 'relative',
        transition: expanded ? 'height 0.2s' : 'height 0.2s 0.1s',
        width: '100%',
      }}
    >
      <Divider />
      <Box
        sx={{
          borderBottom: '1px solid #eee',
          display: 'flex',
          height: expanded ? 54 + householdItems.length * 54 : 54,
          transition: 'height 0.2s',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              height: 50,
              justifyContent: 'center',
              width: 50,
            }}
          >
            <IconButton onClick={() => setExpanded(!expanded)}>
              <KeyboardArrowDown
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.5s',
                }}
              />
            </IconButton>
          </Box>
          <Box
            onClick={() => {
              if (selectedIds) {
                const selectedIdsOnFloor = householdItems
                  .map((item) => item.household.id)
                  .filter((id) => selectedIds.includes(id));

                const allSelected =
                  selectedIdsOnFloor.length == householdItems.length;
                const shouldSelectAll = !allSelected;
                if (shouldSelectAll) {
                  onSelectIds(householdItems.map((item) => item.household.id));
                } else {
                  onDeselectIds(selectedIdsOnFloor);
                }
              }
            }}
            sx={{
              alignItems: 'center',
              border: '1px solid black',
              borderRadius: 1,
              display: 'flex',
              height: 50,
              justifyContent: 'center',
              width: 50,
            }}
          >
            {floor}
          </Box>
        </Box>
        <Box
          sx={{
            left: expanded ? 50 : 104,
            position: 'absolute',
            right: 0,
            top: expanded ? 54 : 0,
            transition: 'left 0.3s, top 0.3s',
          }}
        >
          <HouseholdStack
            expanded={expanded}
            householdItems={householdItems}
            onClick={(householdId) => {
              if (selectedIds) {
                if (selectedIds.includes(householdId)) {
                  onDeselectIds([householdId]);
                } else {
                  onSelectIds([householdId]);
                }
              } else {
                onClick(householdId);
              }
            }}
            onClickVisit={(householdId) => onClickVisit(householdId)}
            selectedIds={selectedIds}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FloorHouseholdGroup;
