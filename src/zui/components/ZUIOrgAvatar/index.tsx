import { FC } from 'react';
import { useTheme } from '@mui/material';

import { ZUISize } from '../types';
import AvatarBackground from '../ZUIPersonAvatar/AvatarBackground';
import { avatarSizes, fontSizes, letterSpacing } from '../ZUIPersonAvatar';

export type ZUIOrgAvatarProps = {
  /**
   * The id of the organization.
   */
  orgId: number;

  /**
   * The size of the avatar, defaults to 'medium'.
   */
  size?: ZUISize;

  /**
   * The title of the organization.
   */
  title: string;
};

const ZUIOrgAvatar: FC<ZUIOrgAvatarProps> = ({
  orgId,
  size = 'medium',
  title,
}) => {
  const theme = useTheme();

  const wordsInTitle = title.split(' ');

  let initials = '';
  if (wordsInTitle.length === 1) {
    initials = wordsInTitle[0].slice(0, 2);
  } else {
    initials = `${wordsInTitle[0][0]}${wordsInTitle[1][0]}`;
  }

  const avatarSize = avatarSizes[size];

  return (
    <AvatarBackground
      seed={orgId.toString() + 'org'}
      size={avatarSize}
      variant="square"
    >
      <text
        dominantBaseline="central"
        fontFamily={theme.typography.fontFamily}
        fontSize={fontSizes[size]}
        fontWeight={600}
        letterSpacing={letterSpacing[size]}
        textAnchor="middle"
        x={avatarSize / 2}
        y={avatarSize / 2}
      >
        {initials.toUpperCase()}
      </text>
    </AvatarBackground>
  );
};

export default ZUIOrgAvatar;
