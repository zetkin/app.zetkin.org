import { FC } from 'react';
import { useTheme } from '@mui/styles';
import { lighten } from '@mui/system';

import { VisitStats } from './getVisitPercentage';

interface MarkerIconProps {
  percentage?: VisitStats;
  selected: boolean;
  uniqueKey?: string;
}

const MarkerIcon: FC<MarkerIconProps> = ({
  uniqueKey,
  percentage,
  selected,
}) => {
  const theme = useTheme();
  const totalVisitsKey = uniqueKey + '_totalVisits';

  return (
    <svg
      fill="white"
      height="30"
      style={{ filter: 'drop-shadow(0px 4px 2px rgba(0, 0, 0, 0.5))' }}
      viewBox="0 0 21 30"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 0C4.695 0 0 4.695 0 10.5C0 18.375 10.5 30 10.5 30C10.5 30 21 18.375 21 10.5C21 4.695 16.305 0 10.5 0Z"
        fill={selected ? '#ED1C55' : 'white'}
      />

      <clipPath id={totalVisitsKey}>
        <rect
          height="30"
          width="21"
          x="0"
          y={percentage ? `${30 - (percentage.totalVisits / 100) * 30}` : '0'}
        />
      </clipPath>
      <path
        clipPath={`url(#${totalVisitsKey})`}
        d="M10.5 3C6 3 3 6.5 3 10.5C3 16 10.5 27 10.5 27C10.5 27 18 16 18 10.5C18 6.5 15 3 10.5 3Z"
        fill={lighten(theme.palette.primary.main, 0.7)}
      />
      <clipPath id={uniqueKey}>
        <rect
          height="30"
          width="21"
          x="0"
          y={
            percentage
              ? `${30 - (percentage.totalSuccessfulVisits / 100) * 30}`
              : '0'
          }
        />
      </clipPath>
      <path
        clipPath={`url(#${uniqueKey})`}
        d="M10.5 3C6 3 3 6.5 3 10.5C3 16 10.5 27 10.5 27C10.5 27 18 16 18 10.5C18 6.5 15 3 10.5 3Z"
        fill={theme.palette.primary.main}
      />
    </svg>
  );
};

export default MarkerIcon;
