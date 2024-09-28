import { Box } from '@mui/system';

type Sizes = 'small' | 'medium' | 'large';

interface ZUIProgressBarProps {
  size: Sizes;
}

const sizes: Record<Sizes, number> = {
  large: 40,
  medium: 20,
  small: 10,
};

const ZUIProgressBar = ({ size }: ZUIProgressBarProps) => {
  return (
    <Box display="flex" width="500px">
      <Box bgcolor={'#7800dc'} height={sizes[size]} width={100} />
    </Box>
  );
};

export default ZUIProgressBar;
