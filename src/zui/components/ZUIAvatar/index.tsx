import { FC } from 'react';
import { useTheme } from '@mui/material';

import { ZUISize } from '../types';
import AvatarBackground from './AvatarBackground';

export interface ZUIAvatarProps {
  /**
   * First name of the person the avatar represents.
   */
  firstName: string;

  /**
   * Id of the person the avatar represents.
   */
  id: number;

  /**
   * Last name of the person the avatar represents.
   */
  lastName: string;

  /**
   * The size of the avatar, defaults to 'medium'.
   */
  size?: ZUISize;

  /**
   * The shape of the avatar, defaults to 'circular'.
   */
  variant?: 'square' | 'circular';
}

const ZUIAvatar: FC<ZUIAvatarProps> = ({
  firstName,
  id,
  lastName,
  size = 'medium',
  variant = 'circular',
}) => {
  const theme = useTheme();

  let avatarSize = 32;
  let fontSize = 16;
  let letterSpacing = 0.11;
  if (size == 'small') {
    avatarSize = 24;
    fontSize = 12;
    letterSpacing = 0.08;
  } else if (size == 'large') {
    avatarSize = 40;
    fontSize = 20;
    letterSpacing = 0.14;
  }

  const initials = firstName.slice(0, 1) + lastName.slice(0, 1);

  return (
    <AvatarBackground seed={id.toString()} size={avatarSize} variant={variant}>
      <text
        dominantBaseline="central"
        fontFamily={theme.typography.fontFamily}
        fontSize={fontSize}
        fontWeight={600}
        letterSpacing={letterSpacing}
        textAnchor="middle"
        x={avatarSize / 2}
        y={avatarSize / 2}
      >
        {initials.toUpperCase()}
      </text>
    </AvatarBackground>
  );
};

export default ZUIAvatar;
