import { Check, Close } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC } from 'react';

import { HouseholdWithColor } from 'features/canvass/types';

type HouseholdItem = {
  household: HouseholdWithColor;
  lastVisitSuccess: boolean;
  lastVisitTime: string;
};

type Props = {
  householdItems: HouseholdItem[];
  onClick: (householdId: number) => void;
};

const FloorHouseholdGroup: FC<Props> = ({ householdItems, onClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      {householdItems.map((householdItem) => {
        const { household, lastVisitSuccess, lastVisitTime } = householdItem;

        return (
          <Box
            key={household.id}
            onClick={() => onClick(household.id)}
            sx={{
              alignItems: 'center',
              border: '1px solid black',
              borderRadius: 4,
              display: 'flex',
              height: 40,
              justifyContent: 'center',
              margin: '2px',
              width: 40,
            }}
          >
            {lastVisitSuccess && <Check color="secondary" fontSize="small" />}
            {!!lastVisitTime && !lastVisitSuccess && (
              <Close color="secondary" fontSize="small" />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default FloorHouseholdGroup;
