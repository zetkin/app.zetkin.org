import { Box } from '@mui/material';
import { FC } from 'react';

import { HouseholdItem } from './types';
import HouseholdStackItem from './HouseholdStackItem';
import { GRID_SQUARE, GRID_SQUARE_WITH_GAP } from './constants';

type Props = {
  expanded: boolean;
  householdItems: HouseholdItem[];
  onClick: (householdId: number) => void;
  onClickDetails: (householdId: number) => void;
  onClickVisit: (householdId: number) => void;
  selectedIds: null | number[];
};

const HouseholdStack: FC<Props> = ({
  expanded,
  householdItems,
  onClick,
  onClickDetails,
  onClickVisit,
  selectedIds,
}) => {
  return (
    <Box>
      {householdItems.map((item, index) => {
        const offset = index * GRID_SQUARE_WITH_GAP;

        return (
          <Box
            key={item.household.id}
            sx={{
              height: GRID_SQUARE,
              left: expanded ? 0 : offset,
              position: 'absolute',
              right: expanded ? 0 : 'auto',
              top: expanded ? offset : 0,
              transition: expanded
                ? 'left 0.2s ease-in, top 0.2s'
                : 'left 0.2s, top 0.1s 0.1s',
              width: expanded ? 'auto' : GRID_SQUARE_WITH_GAP,
            }}
          >
            <HouseholdStackItem
              delay={0.2 + index * 0.02}
              expanded={expanded}
              item={item}
              onClick={() => onClick(item.household.id)}
              onClickDetails={() => onClickDetails(item.household.id)}
              onClickVisit={() => onClickVisit(item.household.id)}
              selectionMode={
                selectedIds
                  ? selectedIds.includes(item.household.id)
                    ? 'selected'
                    : 'unselected'
                  : 'default'
              }
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default HouseholdStack;
