import { Box } from '@mui/system';

type Sizes = 'extraSmall' | 'small' | 'medium' | 'large';

interface ZUIProgressBarProps {
  progress: number; // Number <= 100
  size: Sizes;
}

const sizes: Record<Sizes, number> = {
  extraSmall: 5,
  large: 40,
  medium: 20,
  small: 10,
};

const ZUIProgressBar = ({ progress, size }: ZUIProgressBarProps) => {
  if (progress > 100) {
    throw new Error('Progress > 100');
  }

  const height = sizes[size];

  return (
    <Box display="flex" gap={1} width="100%">
      <Box
        borderRadius={`${height / 2}px 0 0 ${height / 2}px`}
        bgcolor={'#7800dc'}
        height={height}
        width={`${progress}%`}
      />
      <Box bgcolor={'#e4ccf8'} height={height} width={`${100 - progress}%`} />
    </Box>
  );
};

export default ZUIProgressBar;
