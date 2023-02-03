import { Avatar } from '@mui/material';
import { FC } from 'react';

interface ZUIAvatarProps {
  orgId: number;
  personId: number;
  size?: 'sm' | 'md' | 'lg';
}
const SIZES = {
  lg: 50,
  md: 40,
  sm: 30,
};

const ZUIAvatar: FC<ZUIAvatarProps> = ({ orgId, personId, size = 'md' }) => {
  return (
    <Avatar
      src={`/api/orgs/${orgId}/people/${personId}/avatar`}
      style={{ height: SIZES[size], width: SIZES[size] }}
    />
  );
};

export default ZUIAvatar;
