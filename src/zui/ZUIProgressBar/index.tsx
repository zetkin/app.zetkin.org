import { Box } from '@mui/material';

type Sizes = 'extraSmall' | 'small' | 'medium' | 'large';

const sizes: Record<Sizes, number> = {
  extraSmall: 5,
  large: 40,
  medium: 20,
  small: 10,
};

const colors = ['#7800dc', '#9d46e6', '#c189ef', '#e4ccf8'];

interface ZUIProgressBarProps {
  /**
   * Progress as a number < 100, or an array of numbers whose total is < 100.
   */
  progress: number | [number, number] | [number, number, number];
  size: Sizes;
}

const ZUIProgressBar = ({ progress, size }: ZUIProgressBarProps) => {
  const progressArray = typeof progress === 'number' ? [progress] : progress;
  const progressSum = progressArray.reduce((sum, val) => {
    return sum + val;
  });

  if (progressSum > 100) {
    throw new Error('Progress > 100');
  }
  if (progressArray.some((value) => value < 0)) {
    throw new Error('Values can not be negative');
  }

  const height = sizes[size];

  return (
    <Box
      display="flex"
      gap={1}
      borderRadius={height / 2}
      overflow="hidden"
      width="100%"
    >
      {progressArray.map((segmentWidth, index) => {
        if (segmentWidth === 0) return null;
        return (
          <Box
            key={index}
            bgcolor={colors[index]}
            height={height}
            width={`${segmentWidth}%`}
          />
        );
      })}
      <Box
        bgcolor={colors[3]}
        height={height}
        width={`${100 - progressSum}%`}
      />
    </Box>
  );
};

export default ZUIProgressBar;
