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
    <Avatar src={url} style={{ height: SIZES[size], width: SIZES[size] }} />
  );
};

export default ZUIAvatar;
