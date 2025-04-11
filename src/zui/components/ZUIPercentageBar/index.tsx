import { Box, useTheme } from '@mui/material';

import { ZUISize } from '../types';

const sizes: Record<ZUISize, string> = {
  large: '1rem',
  medium: '0.5rem',
  small: '0.25rem',
};

export type ZUIPercentageBarProps = {
  /**
   * The size of the bar diagram.
   *
   * Defaults to "medium"
   */
  size?: ZUISize;

  /**
   * Width of segments as an array of numbers whose total is < 100.
   * The final segment width is the remainder.
   */
  values: [number] | [number, number] | [number, number, number];
};

/**
 * Renders a horizontal stacked bar. Define the percentage width of
 * different segments, up to 100. The final segment width is the
 * remainder of 100 minus the previous segment widths.
 */
const ZUIPercentageBar = ({
  values,
  size = 'medium',
}: ZUIPercentageBarProps) => {
  const theme = useTheme();
  const progressSum = values.reduce((sum, val) => {
    return sum + val;
  });

  if (progressSum > 100) {
    throw new Error('Progress > 100');
  }
  if (values.some((value) => value < 0)) {
    throw new Error('Values can not be negative');
  }

  const height = sizes[size];

  const colors =
    values.length == 3
      ? [
          theme.palette.data.main,
          theme.palette.data.mid3,
          theme.palette.data.mid1,
          theme.palette.data.final,
        ]
      : [
          theme.palette.data.main,
          theme.palette.data.mid2,
          theme.palette.data.final,
        ];

  return (
    <Box
      sx={{
        borderRadius: '2rem',
        display: 'flex',
        gap: size === 'large' ? '0.25rem' : '0.125rem',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {values.map((segmentWidth, index) => {
        if (!segmentWidth) {
          return null;
        }
        return (
          <Box
            key={index}
            sx={{
              backgroundColor: colors[index],
              height: height,
              width: `${segmentWidth}%`,
            }}
          />
        );
      })}
      {progressSum < 100 && (
        <Box
          sx={{ backgroundColor: colors.at(-1), flexGrow: 1, height: height }}
        />
      )}
    </Box>
  );
};

export default ZUIPercentageBar;
