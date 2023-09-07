/* eslint-disable react/display-name */
import ZUIAvatar from 'zui/ZUIAvatar';

interface ZUIUserAvatarProps {
  personId: number;
  size?: 'sm' | 'md' | 'lg';
}

const ZUIUserAvatar: React.FC<ZUIUserAvatarProps> = ({
  personId,
  size = 'md',
}) => {
  return <ZUIAvatar url={`/api/users/${personId}/avatar`} size={size} />;
};

export default ZUIUserAvatar;
