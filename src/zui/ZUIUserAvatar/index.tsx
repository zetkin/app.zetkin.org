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
  return <ZUIAvatar size={size} url={`/api/users/${personId}/avatar`} />;
};

export default ZUIUserAvatar;
