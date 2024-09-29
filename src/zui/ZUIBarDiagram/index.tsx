import { Box } from '@mui/material';

type Sizes = 'extraSmall' | 'small' | 'medium' | 'large';

const sizes: Record<Sizes, number> = {
  extraSmall: 5,
  large: 30,
  medium: 20,
  small: 10,
};

const colors = ['#7800dc', '#9d46e6', '#c189ef', '#e4ccf8'];

interface ZUIBarDiagramProps {
  /**
   * Progress as a number < 100, or an array of numbers whose total is < 100.
   */
  progress: number | [number, number] | [number, number, number];
  size: Sizes;
}

/**
 * Renders a horizontal stacked bar. Define the percentage width of
 * different segments, up to 100. The final segment width is the
 * remainder of 100 minus the previous segment widths.
 */
const ZUIBarDiagram = ({ progress, size }: ZUIBarDiagramProps) => {
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
      borderRadius={height / 2}
      display="flex"
      gap={size === 'large' ? 0.75 : 0.5}
      overflow="hidden"
      width="100%"
    >
      {progressArray.map((segmentWidth, index) => {
        if (segmentWidth === 0) {
          return null;
        }
        return (
          <Box
            key={index}
            bgcolor={colors[index]}
            height={height}
            width={`${segmentWidth}%`}
          />
        );
      })}
      {progressSum < 100 && (
        <Box bgcolor={colors.at(-1)} flexGrow={1} height={height} />
      )}
    </Box>
  );
};

export default ZUIBarDiagram;
