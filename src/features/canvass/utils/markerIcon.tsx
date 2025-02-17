import { FC } from 'react';
import { useTheme } from '@mui/styles';
import { lighten } from '@mui/system';

import { ProgressState } from './getVisitState';
import { Household } from 'features/areaAssignments/types';

export function getVisitPercentage(
  households: Household[],
  areaAssId: string | null
): number {
  if (households.length === 0) {
    return 0;
  }
  const numberOfVisitedHouseholds = households.filter((household) =>
    household.visits.some((visit) => visit.areaAssId === areaAssId)
  ).length;

  return Math.round((numberOfVisitedHouseholds / households.length) * 100);
}

interface MarkerIconProps {
  dataToShow?: 'done' | 'visited';
  uniqueKey?: string;
  percentatge?: number;
  state?: ProgressState;
  selected: boolean;
}

const MarkerIcon: FC<MarkerIconProps> = ({
  dataToShow = 'visited',
  uniqueKey,
  percentatge,
  state = 'none',
  selected,
}) => {
  const theme = useTheme();

  const circleColors: Record<ProgressState, string> = {
    all:
      dataToShow == 'visited'
        ? theme.palette.primary.main
        : theme.palette.success.main,
    none: theme.palette.grey[400],
    some:
      dataToShow == 'visited'
        ? theme.palette.primary.main
        : lighten(theme.palette.success.main, 0.5),
  };

  return (
    <svg
      fill="white"
      height="30"
      viewBox="0 0 21 30"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 0C4.695 0 0 4.695 0 10.5C0 18.375 10.5 30 10.5 30C10.5 30 21 18.375 21 10.5C21 4.695 16.305 0 10.5 0Z"
        fill={selected ? '#ED1C55' : 'white'}
      />

      <path
        d="M10.5 3C6 3 3 6.5 3 10.5C3 16 10.5 27 10.5 27C10.5 27 18 16 18 10.5C18 6.5 15 3 10.5 3Z"
        fill={theme.palette.grey[400]}
      />
      <clipPath id={uniqueKey}>
        <rect
          height="30"
          width="21"
          x="0"
          y={percentatge ? `${30 - (percentatge / 100) * 30}` : '0'}
        />
      </clipPath>
      <path
        clipPath={`url(#${uniqueKey})`}
        d="M10.5 3C6 3 3 6.5 3 10.5C3 16 10.5 27 10.5 27C10.5 27 18 16 18 10.5C18 6.5 15 3 10.5 3Z"
        fill={circleColors[state]}
      />
    </svg>
  );
};

export default MarkerIcon;
