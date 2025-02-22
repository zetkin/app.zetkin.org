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
  const maxValue = Math.max(...data.map((row) => row.value));
  const scale = visualizationHeight / maxValue;

  return (
    <Box>
      <Typography className="title" pb={1}>
        {title}
      </Typography>
      <Typography className="description" pb={1}>
        {description}
      </Typography>
      <Box className="chart" component="section">
        <Box className="scale">
          <Box className="numbers">
            <Typography className="number">{maxValue}</Typography>
            <Typography className="number">0</Typography>
          </Box>
          <Box className="lines">
            <Box className="line"></Box>
            <Box className="line"></Box>
            <Box className="line"></Box>
          </Box>
        </Box>
        <Box className="bars" component="ol">
          {data.map((row, index) => {
            return (
              <Box key={index} component="li">
                <Typography></Typography>
                <Typography component="span" className="value">
                  {row.value}
                </Typography>
                <Typography component="span" className="label">
                  {row.label}
                </Typography>
                <Typography
                  className="bar"
                  component="span"
                  style={{
                    height: row.value * scale,
                  }}
                ></Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ZUIBarChart;
