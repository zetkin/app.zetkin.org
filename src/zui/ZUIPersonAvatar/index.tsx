/* eslint-disable react/display-name */
import ZUIAvatar from 'zui/ZUIAvatar';

interface ZUIPersonAvatarProps {
  orgId: number;
  personId: number;
  size?: 'sm' | 'md' | 'lg';
}

const ZUIPersonAvatar: React.FC<ZUIPersonAvatarProps> = ({
  orgId,
  personId,
  size = 'md',
}) => {
  return (
    <ZUIAvatar
      url={`/api/orgs/${orgId}/people/${personId}/avatar`}
      size={size}
    />
  );
};

export default ZUIPersonAvatar;
