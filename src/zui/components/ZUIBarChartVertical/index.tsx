import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import ZUIBarChartVerticalScale from './ZUIBarChartVerticalScale';
import ZUIBarChartVerticalBars from './ZUIBarChartVerticalBars';

export interface ZUIBarChartProps {
  data: {
    label: string;
    value: number;
  }[];
  description: string;
  hideScale?: boolean;
  maxValue?: number;
  title: string;
  visualizationHeight?: number;
}

const ZUIBarChart: FC<ZUIBarChartProps> = ({
  data,
  description,
  hideScale = false,
  maxValue,
  title,
  visualizationHeight = 50,
}) => {
  const localMaxValue = Math.max(
    maxValue || 0,
    ...data.map((row) => row.value)
  );
  const style = {
    chart: {
      display: 'flex',
      flexDirection: 'row',
      gap: 0.5,
      paddingBlock: 2.5,
    },
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: 0.5,
    },
  };

  return (
    <Box>
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
      <Box className={`chart`} component="section" sx={style.chart}>
        {!hideScale && <ZUIBarChartVerticalScale maxValue={localMaxValue} />}
        <ZUIBarChartVerticalBars
          data={data}
          maxValue={localMaxValue}
          visualizationHeight={visualizationHeight}
        />
      </Box>
    </Box>
  );
};

export default ZUIBarChart;
