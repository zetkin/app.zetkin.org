import { FC } from 'react';

import { avatarSizes } from '../ZUIPersonAvatar';
import { ZUISize } from '../types';

type ZUIOrgLogoAvatarProps = {
  /**
   * The id of the organization
   */
  orgId: number;

  /**
   * The size of the avatar
   */
  size?: ZUISize;

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
  size = 'medium',
  urlBase = '/api',
}) => {
  return (
    /* eslint-disable @next/next/no-img-element*/
    //TODO: Investigate how we can use the Image component from Next.js here
    <img
      alt="icon"
      height={avatarSizes[size]}
      src={`${urlBase}/orgs/${orgId}/avatar`}
      width={avatarSizes[size]}
    />
  );
};

export default ZUIOrgLogoAvatar;
