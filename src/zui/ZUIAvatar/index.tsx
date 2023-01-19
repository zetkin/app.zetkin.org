import { Avatar } from '@mui/material';
import { FC } from 'react';

interface ZUIAvatarProps {
  orgId: number;
  personId: number;
}

const ZUIAvatar: FC<ZUIAvatarProps> = ({ orgId, personId }) => {
  return <Avatar src={`/api/orgs/${orgId}/people/${personId}/avatar`} />;
};

export default ZUIAvatar;
