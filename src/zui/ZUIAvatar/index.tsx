import { Avatar } from '@mui/material';

interface ZUIAvatarProps {
  url: string;
  size: 'sm' | 'md' | 'lg';
}

const SIZES = {
  lg: 50,
  md: 40,
  sm: 30,
};

const ZUIAvatar: React.FC<ZUIAvatarProps> = ({ url, size }) => {
  return (
    <Avatar src={url} style={{ width: SIZES[size], height: SIZES[size] }} />
  );
};

export default ZUIAvatar;
