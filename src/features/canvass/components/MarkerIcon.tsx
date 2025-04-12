import { FC } from 'react';
import { useTheme } from '@mui/styles';
import { lighten } from '@mui/system';

import { VisitStats } from '../utils/getVisitPercentage';

interface MarkerIconProps {
  percentage?: VisitStats;
  selected: boolean;
}

const MarkerIcon: FC<MarkerIconProps> = ({ percentage, selected }) => {
  const theme = useTheme();

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
        fill={selected ? theme.palette.primary.main : 'white'}
      />
      <clipPath id="pinInterior">
        <path d="M10.5 3C6 3 3 6.5 3 10.5C3 16 10.5 27 10.5 27C10.5 27 18 16 18 10.5C18 6.5 15 3 10.5 3Z" />
      </clipPath>
      <rect
        clipPath="url(#pinInterior)"
        fill="white"
        height="30"
        width="21"
        x="0"
        y="0"
      />
      <rect
        clipPath="url(#pinInterior)"
        fill={lighten(theme.palette.primary.main, 0.7)}
        height="30"
        width="21"
        x="0"
        y={percentage ? `${30 - (percentage.totalVisits / 100) * 30}` : '0'}
      />
      <rect
        clipPath="url(#pinInterior)"
        fill={theme.palette.primary.main}
        height="30"
        width="21"
        x="0"
        y={
          percentage
            ? `${30 - (percentage.totalSuccessfulVisits / 100) * 30}`
            : '0'
        }
      />
    </svg>
  );
};

export default MarkerIcon;
