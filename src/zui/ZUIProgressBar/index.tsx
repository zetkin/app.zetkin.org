import { Box } from '@mui/material';

type Sizes = 'extraSmall' | 'small' | 'medium' | 'large';

interface ZUIProgressBarProps {
  /**
   * Progress as a number < 100, or an array of numbers whose total is < 100.
   */
  progress: number | [number, number] | [number, number, number];
  size: Sizes;
}

const sizes: Record<Sizes, number> = {
  extraSmall: 5,
  large: 40,
  medium: 20,
  small: 10,
};

const colors = ['#7800dc', '#9d46e6', '#c189ef', '#e4ccf8'];

const ZUIProgressBar = ({ progress, size }: ZUIProgressBarProps) => {
  const progressArray = typeof progress === 'number' ? [progress] : progress;

  const progressSum = progressArray.reduce((sum, val) => {
    return sum + val;
  });

  if (progressSum > 100) {
    throw new Error('Progress > 100');
  }

  const height = sizes[size];

  return (
    <Box display="flex" gap={1} width="100%">
      {progressArray.map((segmentWidth, index) => {
        return (
          <Box
            borderRadius={
              index === 0 ? `${height / 2}px 0 0 ${height / 2}px` : undefined
            }
            bgcolor={colors[index]}
            height={height}
            width={`${segmentWidth}%`}
          />
        );
      })}
      <Box
        borderRadius={`0 ${height / 2}px ${height / 2}px 0`}
        bgcolor={colors[3]}
        height={height}
        width={`${100 - progressSum}%`}
      />
    </Box>
  );
};

export default ZUIProgressBar;
