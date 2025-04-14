import { FC, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

import ZUIAvatar, { ZUIAvatarProps } from '../ZUIAvatar';
import ZUIButton from '../ZUIButton';

type ZUIItemCardProps = {
  /**
   * An avatar to be displayed to the left of the card title.
   */
  avatar?: Omit<ZUIAvatarProps, 'size' | 'variant'>;

  button?: {
    /**
     * The label of the button
     */

    label: string;
    /**
     * The function that runs when pressing the button.
     */
    onClick: () => void;
  };

  /**
   * The description of the card.
   */
  description?: (string | ReactNode)[];

  /**
   * The image to display at the top of the card.
   *
   * This element needs to have its height set to 100%.
   */
  image?: JSX.Element;

  /**
   * The subtitle of the card
   */
  subtitle?: string;

  /**
   * The title of the card.
   */
  title: string;
};

const ZUIItemCard: FC<ZUIItemCardProps> = ({
  avatar,
  button,
  description,
  image,
  subtitle,
  title,
}) => (
  <Box
    sx={(theme) => ({
      border: `0.063rem solid ${theme.palette.dividers.main}`,
      borderRadius: '0.25rem',
    })}
  >
    {image && <Box sx={{ height: '9.375rem' }}>{image}</Box>}
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '1.25rem',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
          {avatar && (
            <ZUIAvatar
              firstName={avatar.firstName}
              id={avatar.id}
              lastName={avatar.lastName}
              size="large"
            />
          )}
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}
          >
            <Typography variant="bodyMdSemiBold">{title}</Typography>
            {subtitle && (
              <Typography variant="bodyMdRegular">{subtitle}</Typography>
            )}
          </Box>
        </Box>
        {description &&
          (typeof description == 'string' ? (
            <Typography variant="bodySmRegular">{description}</Typography>
          ) : (
            description
          ))}
      </Box>
      {button && (
        <Box sx={{ display: 'flex' }}>
          <ZUIButton
            label={button.label}
            onClick={button.onClick}
            size="large"
            variant="secondary"
          />
        </Box>
      )}
    </Box>
  </Box>
);

export default ZUIItemCard;
