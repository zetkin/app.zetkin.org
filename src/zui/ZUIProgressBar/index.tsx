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

  return (
    <Box display="flex" width="100%">
      <Box bgcolor={'#7800dc'} height={sizes[size]} width={`${progress}%`} />
      <Box
        bgcolor={'#e4ccf8'}
        height={sizes[size]}
        width={`${100 - progress}%`}
      />
    </Box>
  );
};

export default ZUIProgressBar;
