import { Divider } from '@mui/material';

interface ZUIDividerProps {
  orientation: 'horizontal' | 'vertical';
}

const ZUIDivider: React.FC<ZUIDividerProps> = ({ orientation }) => {
  return <Divider orientation={orientation} sx={{ color: '#E0E0E0' }} />;
};

export default ZUIDivider;
