import { FC, useRef, useState } from 'react';
import { Box, Popper, Typography } from '@mui/material';
import { useTheme } from '@mui/system';

import ZUIBarChartBar from './ZUIBarChartBar';

export interface ZUIBarChartProps {
  data: {
    label: string;
    value: number;
  }[];
  description: string;
  title: string;
  visualizationHeight?: number;
  orientation?: 'horizontal' | 'vertical';
}

const ZUIBarChart: FC<ZUIBarChartProps> = ({
  data,
  description,
  title,
  visualizationHeight = 50,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const chartRef = useRef(null);
  const theme = useTheme();
  const maxValue = Math.max(...data.map((row) => row.value));
  const popperOpen = Boolean(anchorEl);

  function setActive(
    anchorEl: HTMLElement | null = null,
    label: string | null = null,
    value: number | null = null
  ) {
    setAnchorEl(anchorEl);
    setCurrentLabel(label);
    setCurrentValue(value);
  }

  const containerStyle = {};
  const chartStyle = {
    '& .sr-only': {
      border: 0,
      clipPath: 'inset(50%)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      width: '1px',
      wordWrap: 'normal !important',
    },
    display: 'flex',
    flexDirection: 'row',
    gap: 0.5,
  };

  const scaleStyle = {
    color: theme.palette.text.secondary,
    display: 'flex',
    gap: 0.5,
    height: '100%',
    justifyContent: 'space-between',
  };
  const numbersStyle = {
    '& span:first-of-type': {
      translate: '0 -50%',
    },
    '& span:last-of-type': {
      translate: '0 50%',
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'right',
  };
  const linesStyle = {
    '& .line': {
      backgroundColor: 'currentColor',
      height: '1px',
      width: theme.spacing(0.5),
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };
  const barsStyle = {
    '& li:hover .bar': {
      backgroundColor: 'data.mid2',
    },
    '&:has(li:hover) .bar': {
      backgroundColor: 'data.final',
    },
    '&:has(li:hover) .label': {
      opacity: 0,
    },
    display: 'flex',
    flex: '1',
    height: visualizationHeight,
    justifyContent: 'stretch',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };
  const popperStyle = {
    '& div': { lineHeight: 1 },
    color: 'data.main',
    width: 'auto',
  };
  const popperMods = [
    {
      enabled: true,
      name: 'preventOverflow',
      options: {
        padding: 0,
      },
    },
    {
      name: 'offset',
      options: {
        offset: [0, 4], // NOTE: The offset cant be set with theme.spacing as it returns a string.
      },
    },
  ];
  return (
    <Box sx={containerStyle}>
      <Typography className="title" component="p" variant="labelLgMedium">
        {title}
      </Typography>
      <Typography
        className="description"
        component="p"
        variant="labelMdRegular"
      >
        {description}
      </Typography>
      <Box className="chart" component="section" sx={chartStyle}>
        <Box className="scaleContainer" sx={{ paddingBlock: 2.5 }}>
          <Box className="scale" sx={scaleStyle}>
            <Box className="numbers" sx={numbersStyle}>
              <Typography className="number" variant="labelSmMedium">
                {maxValue}
              </Typography>
              <Typography className="number" variant="labelSmMedium">
                0
              </Typography>
            </Box>
            <Box className="lines" sx={linesStyle}>
              <Box className="line" />
              <Box className="line" />
              <Box className="line" />
            </Box>
          </Box>
        </Box>
        <Box
          className="barsContainer"
          sx={{ overflow: 'hidden', paddingBlock: 2.5, width: '100%' }}
        >
          <Box ref={chartRef} className="bars" component="ol" sx={barsStyle}>
            {data.map((row, index) => {
              return (
                <ZUIBarChartBar
                  key={index}
                  label={row.label}
                  maxValue={maxValue}
                  setActive={setActive}
                  value={row.value}
                />
              );
            })}
          </Box>
        </Box>
        <Popper
          anchorEl={anchorEl}
          disablePortal={true}
          modifiers={popperMods}
          open={popperOpen}
          placement="bottom"
          sx={popperStyle}
        >
          <Typography component={'div'} variant="labelSmMedium">
            {currentLabel}
          </Typography>
        </Popper>

        <Popper
          anchorEl={anchorEl}
          disablePortal={true}
          modifiers={popperMods}
          open={popperOpen}
          placement="top"
          sx={popperStyle}
        >
          <Typography component={'div'} variant="labelSmMedium">
            {currentValue}
          </Typography>
        </Popper>
      </Box>
    </Box>
  );
};

export default ZUIBarChart;
