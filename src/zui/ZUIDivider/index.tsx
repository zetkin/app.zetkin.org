import { Divider, DividerProps } from '@mui/material';

interface ZUIDividerProps extends DividerProps {}

const ZUIDivider: React.FC<ZUIDividerProps> = ({ sx, ...props }) => {
  const _sx = {
    color: '#E0E0E0',
    ...sx,
  };
  return <Divider sx={_sx} {...props} />;
};

export default ZUIDivider;
