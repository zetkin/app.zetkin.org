import { Box } from '@mui/material';
import { FC } from 'react';

import { HouseholdItem } from './types';
import HouseholdStackItem from './HouseholdStackItem';

type Props = {
  expanded: boolean;
  householdItems: HouseholdItem[];
  onClick: (householdId: number) => void;
  selectedIds: null | number[];
};

const HouseholdStack: FC<Props> = ({
  expanded,
  householdItems,
  onClick,
  selectedIds,
}) => {
  return (
    <Box>
      {householdItems.map((item, index) => {
        const offset = index * 54;

        return (
          <Box
            key={item.household.id}
            sx={{
              height: 50,
              left: expanded ? 0 : offset,
              position: 'absolute',
              top: expanded ? offset : 0,
              transition: expanded
                ? 'left 0.2s ease-in, top 0.2s'
                : 'left 0.2s, top 0.1s 0.1s',
              width: expanded ? 'auto' : 54,
            }}
          >
            <HouseholdStackItem
              delay={0.2 + index * 0.02}
              expanded={expanded}
              item={item}
              onClick={() => onClick(item.household.id)}
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
