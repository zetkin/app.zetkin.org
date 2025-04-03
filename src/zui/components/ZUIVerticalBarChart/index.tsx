import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import Bars from './Bars';
import Scale from './Scale';

type ZUIVerticalBarChartProps = {
  /**
   * An array of data points to be visualized. Every data point should have a
   * label and a value.
   */
  data: {
    label: string;
    value: number;
  }[];
  /**
   * A string that describes the data being visualized or comments on the data
   * in some way
   */
  description: string;
  /**
   * If the scale should be hidden or not. Defaults to 'false'
   */
  hideScale?: boolean;
  /**
   * The maximum value in the scale. If not provided, the component will use
   * the highest value in the data.
   *
   * If the provided value is lower than the highest value in the data, the
   * component will use the highest value in the data.
   */
  maxValue?: number;
  /**
   * The title of the chart
   */
  title: string;
  /**
   * The height of the visualization in pixels. Defaults to 50.
   */
  visualizationHeight?: number;
};

const ZUIVerticalBarChart: FC<ZUIVerticalBarChartProps> = ({
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

  return (
    <Box>
      <Typography variant="labelLgMedium">{title}</Typography>
      <Typography variant="labelMdRegular">{description}</Typography>
      <Box
        component="section"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '0.25rem',
          paddingBlock: '1.25rem',
        }}
      >
        {!hideScale && <Scale maxValue={localMaxValue} />}
        <Bars
          data={data}
          maxValue={localMaxValue}
          visualizationHeight={visualizationHeight}
        />
      </Box>
    </Box>
  );
};

export default ZUIVerticalBarChart;
