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
  title: string;
  visualizationHeight?: number;
}

const ZUIBarChart: FC<ZUIBarChartProps> = ({
  data,
  description,
  hideScale = false,
  title,
  visualizationHeight = 50,
}) => {
  const maxValue = Math.max(...data.map((row) => row.value));
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
        {!hideScale && <ZUIBarChartVerticalScale maxValue={maxValue} />}
        <ZUIBarChartVerticalBars
          data={data}
          maxValue={maxValue}
          visualizationHeight={visualizationHeight}
        />
      </Box>
    </Box>
  );
};

export default ZUIBarChart;
