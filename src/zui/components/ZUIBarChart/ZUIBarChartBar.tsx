import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import { useTheme } from '@mui/system';

export interface ZUIBarChartBarProps {
  label: string;
  maxValue: number;
  setActive: (
    hoveredEl?: HTMLElement | null,
    label?: string | null,
    value?: number | null
  ) => void;
  orientation?: 'horizontal' | 'vertical';
  value: number;
}

const ZUIBarChartBar: FC<ZUIBarChartBarProps> = ({
  label,
  maxValue,
  setActive,
  value,
}) => {
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setActive(
      event.currentTarget.querySelector('.bar') as HTMLElement | null,
      label,
      value
    );
  };
  const handleMouseLeave = () => {
    setActive();
  };

  const theme = useTheme();
  const itemStyle = {
    '@container (max-width: 4em)': {
      '& .label': {
        opacity: 0,
      },
    },
    alignItems: 'end',
    containerType: 'inline-size',
    display: 'flex',
    flex: 1,
    height: '100%',
    paddingInline: 0,
    position: 'relative',
  };
  const labelStyle = {
    color: theme.palette.text.secondary,
    left: 0,
    overflow: 'hidden',
    paddingInline: 1,
    pointerEvents: 'none',
    position: 'absolute',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    top: `calc(100% + ${theme.spacing(0.25)})`,
    transitionDuration: '0.3s',
    transitionProperty: 'opacity',
    whiteSpace: 'nowrap',
    width: '100%',
  };
  const valueStyle = {
    color: 'data.main',
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
  };
  const barStyle = {
    backgroundColor: 'data.mid1',
    borderRadius: 1,
    flex: 1,
    marginInline: `min(${theme.spacing(0.5)}, 10%)`,
    position: 'relative',
    transition: 'background-color 0.3s',
  };

  return (
    <Box
      component="li"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={itemStyle}
    >
      <Typography
        className="label"
        component="span"
        sx={labelStyle}
        variant="labelSmMedium"
      >
        {label}
      </Typography>
      <Typography
        className="value sr-only"
        component="span"
        sx={valueStyle}
        variant="labelSmMedium"
      >
        {value}
      </Typography>
      <Box
        className="bar"
        style={{
          height: `${(value / maxValue) * 100}%`,
        }}
        sx={barStyle}
      />
    </Box>
  );
};
export default ZUIBarChartBar;
