import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import { useTheme } from '@mui/system';

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
  const theme = useTheme();
  const maxValue = Math.max(...data.map((row) => row.value));

  const containerStyle = {
    paddingBlock: 2,
  };
  const chartStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: 0.5,
    marginTop: 2,
  };
  const scaleStyle = {
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 0.5,
  };
  const numbersStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'right',
    '& :first-child': {
      translate: '0 -50%',
    },
    '& :last-child': {
      translate: '0 50%',
    },
  };
  const linesStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    '& .line': {
      backgroundColor: 'currentColor',
      width: theme.spacing(0.5),
      height: '1px',
    },
  };
  const barsStyle = {
    display: 'flex',
    flex: '1',
    height: visualizationHeight,
    justifyContent: 'stretch',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    '&:has(li:hover) .bar': {
      backgroundColor: 'data.final',
    },
    '&:has(li:hover) .label': {
      opacity: 0,
      color: 'data.main',
      left: '50%',
      translate: '-50%',
      width: 'auto',
    },
    '& li:hover .bar': {
      backgroundColor: 'data.mid2',
    },
    '& li:hover .label': {
      opacity: 1,
    },
  };
  const itemStyle = {
    alignItems: 'end',
    display: 'flex',
    flex: 1,
    height: '100%',
    paddingInline: 0.5,
    position: 'relative',
    '&:hover .value': {
      opacity: 1,
    },
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
    transitionProperty: 'color, opacity',
    transitionDuration: '0.3s',
    whiteSpace: 'nowrap',
    width: '100%',
  };
  const valueStyle = {
    bottom: `calc(100% + ${theme.spacing(0.25)})`,
    color: 'data.main',
    left: '50%',
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    translate: '-50%',
  };
  const barStyle = {
    flex: 1,
    position: 'relative',
    backgroundColor: 'data.mid1',
    borderRadius: 1,
    transition: 'background-color 0.3s',
  };

  return (
    <Box sx={containerStyle}>
      <Typography className="title" component="p" variant="labelLgMedium">
        {title}
      </Typography>
      <Typography
        className="description"
        component="p"
        pb={1}
        variant="labelMdRegular"
      >
        {description}
      </Typography>
      <Box className="chart" component="section" sx={chartStyle}>
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
            <Box className="line"></Box>
            <Box className="line"></Box>
            <Box className="line"></Box>
          </Box>
        </Box>
        <Box className="bars" component="ol" sx={barsStyle}>
          {data.map((row, index) => {
            return (
              <Box key={index} component="li" sx={itemStyle}>
                <Typography
                  component="span"
                  className="label"
                  sx={labelStyle}
                  variant="labelSmMedium"
                >
                  {row.label}
                </Typography>
                <Typography
                  component="span"
                  className="divider"
                  sx={{ display: 'none' }}
                  variant="labelSmMedium"
                >
                  {': '}
                </Typography>
                <Typography
                  component="span"
                  className="value"
                  sx={[
                    valueStyle,
                    {
                      bottom: `calc(${
                        (row.value / maxValue) * 100
                      }% + ${theme.spacing(0.25)})`,
                    },
                  ]}
                  variant="labelSmMedium"
                >
                  {row.value}
                </Typography>
                <Box
                  className="bar"
                  style={{
                    height: `${(row.value / maxValue) * 100}%`,
                  }}
                  sx={barStyle}
                ></Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ZUIBarChart;
