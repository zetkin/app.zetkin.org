import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import ZUIPersonAvatar from '../ZUIPersonAvatar';
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
};

const fontSizes: Record<ZUISize, string> = {
  large: '1rem',
  medium: '0.875rem',
  small: '0.625rem',
};

const avatarSizes: Record<ZUISize, string> = {
  large: '2.5rem',
  medium: '2rem',
  small: '1.5rem',
};

const ZUIAvatarGroup: FC<ZUIAvatarGroupProps> = ({
  avatars,
  max,
  size = 'medium',
}) => {
  const showOverflowNumber = !!max && max < avatars.length;

  return (
    <Box sx={{ display: 'flex', gap: '0.25rem' }}>
      {avatars.map((avatar, index) => {
        if (showOverflowNumber && index > max - 2) {
          return;
        }
        return (
          <ZUIPersonAvatar
            key={avatar.id}
            firstName={avatar.firstName}
            id={avatar.id}
            lastName={avatar.lastName}
            size={size}
          />
        );
      })}
      {showOverflowNumber && (
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            backgroundColor: theme.palette.grey[100],
            borderRadius: '10rem',
            display: 'flex',
            height: avatarSizes[size],
            justifyContent: 'center',
            width: avatarSizes[size],
          })}
        >
          <Typography
            sx={(theme) => ({
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              fontSize: fontSizes[size],
              fontWeight: 500,
            })}
          >
            {'+' + (avatars.length - max + 1)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ZUIAvatarGroup;
