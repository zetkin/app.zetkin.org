import { FC } from 'react';

import ZUIAvatar from 'zui/ZUIAvatar';

type ZUIOrgLogoAvatarProps = {
  /**
   * The id of the organization
   */
  orgId?: number;
  size?: 'sm' | 'md' | 'lg';
  /**
   * If there is need to send in a custom url base to fetch the avatar,
   * do this here.
   *
   * Defaults to "/api"
   */
  urlBase?: string;
};

const ZUIOrgLogoAvatar: FC<ZUIOrgLogoAvatarProps> = ({
  orgId,
  urlBase = '/api',
  size = 'md',
}) => {
  return <ZUIAvatar size={size} url={`${urlBase}/orgs/${orgId}/avatar`} />;
};

export default ZUIOrgLogoAvatar;
