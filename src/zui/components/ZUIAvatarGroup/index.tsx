import { Box, Typography, useTheme } from '@mui/material';
import { FC } from 'react';

import ZUIAvatar from '../ZUIAvatar';
import { ZUISize } from '../types';

export type AvatarData = {
  firstName: string;
  id: number;
  lastName: string;
};

type ZUIAvatarGroupProps = {
  /**
   * List of the people you want to display as avatars.
   */
  avatars: AvatarData[];

  /**
   * Maximum number of avatars shown.
   */
  max?: number;

  /**
   * The size of the avatars. Defaults to 'medium'.
   */
  size?: ZUISize;

  /**
   * The shape of the avatars. Defaults to 'circular.
   */
  variant?: 'circular' | 'square';
};

const ZUIAvatarGroup: FC<ZUIAvatarGroupProps> = ({
  avatars,
  max,
  size = 'medium',
  variant = 'circular',
}) => {
  const theme = useTheme();

  let avatarSize = '2rem';
  let fontSize = '0.875rem';
  if (size == 'small') {
    avatarSize = '1.5rem';
    fontSize = '0.625rem';
  } else if (size == 'large') {
    avatarSize = '3rem';
    fontSize = '1rem';
  }

  const showOverflowNumber = !!max && max < avatars.length;

  return (
    <Box display="flex" gap="0.25rem">
      {avatars.map((avatar, index) => {
        if (showOverflowNumber && index > max - 2) {
          return;
        }
        return (
          <ZUIAvatar
            key={avatar.id}
            firstName={avatar.firstName}
            id={avatar.id}
            lastName={avatar.lastName}
            size={size}
            variant={variant}
          />
        );
      })}
      {showOverflowNumber && (
        <Box
          alignItems="center"
          bgcolor={theme.palette.grey[100]}
          borderRadius={variant == 'circular' ? 100 : '0.25rem'}
          display="flex"
          height={avatarSize}
          justifyContent="center"
          width={avatarSize}
        >
          <Typography
            color={theme.palette.text.primary}
            fontFamily={theme.typography.fontFamily}
            fontSize={fontSize}
            fontWeight={500}
          >
            {'+' + (avatars.length - max + 1)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ZUIAvatarGroup;
