import { CircularProgress } from '@mui/material';
import { FC } from 'react';

import ZUIMultiNumberChip from 'zui/ZUIMultiNumberChip';
import ActivityListItem, { ActivityListItemProps } from './ActivityListItem';

type ActivityListItemWithStatsProps = ActivityListItemProps & {
  blueChipValue?: string | number;
  greenChipValue: string | number | undefined;
  orangeChipValue: string | number | undefined;
  statsLoading: boolean;
};

const ActivityListItemWithStats: FC<ActivityListItemWithStatsProps> = ({
  blueChipValue,
  greenChipValue,
  orangeChipValue,
  statsLoading,
  ...restProps
}) => {
  return (
    <ActivityListItem
      {...restProps}
      meta={
        statsLoading ? (
          <CircularProgress size={26} />
        ) : (
          <ZUIMultiNumberChip
            blueValue={blueChipValue}
            greenValue={greenChipValue}
            orangeValue={orangeChipValue}
          />
        )
      }
    />
  );
};

export default ActivityListItemWithStats;
