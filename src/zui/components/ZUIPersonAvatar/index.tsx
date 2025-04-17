import { FC } from 'react';
import { useTheme } from '@mui/material';

import { ZUISize } from '../types';
import AvatarBackground from './AvatarBackground';

export interface ZUIPersonAvatarProps {
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
}

export const fontSizes: Record<ZUISize, number> = {
  large: 20,
  medium: 16,
  small: 12,
};

export const avatarSizes: Record<ZUISize, number> = {
  large: 40,
  medium: 32,
  small: 24,
};

export const letterSpacing: Record<ZUISize, number> = {
  large: 0.14,
  medium: 0.11,
  small: 0.08,
};

const ZUIPersonAvatar: FC<ZUIPersonAvatarProps> = ({
  firstName,
  id,
  lastName,
  size = 'medium',
}) => {
  const theme = useTheme();

  const initials = firstName.slice(0, 1) + lastName.slice(0, 1);
  const avatarSize = avatarSizes[size];

  return (
    <AvatarBackground seed={id.toString()} size={avatarSize} variant="circular">
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

export default ZUIPersonAvatar;
