import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import { MUIIcon } from '../types';

type ZUITargetGroupChipProps = {
  /**
   * The MUI icon to be used.
   *
   * Pass in reference to the icon, for example: Close, not < Close / >.
   */
  icon: MUIIcon;

  /**
   * The text to be shown
   */
  label: string;
};

const ZUITargetGroupChip: FC<ZUITargetGroupChipProps> = ({
  icon: Icon,
  label,
}) => (
  <Box
    sx={(theme) => ({
      alignItems: 'center',
      backgroundColor: theme.palette.grey[100],
      borderRadius: '2rem',
      display: 'inline-flex',
      padding: '0.25rem 0.25rem 0.25rem 0.5rem',
    })}
  >
    <Icon
      sx={(theme) => ({ color: theme.palette.grey[400], fontSize: '1rem' })}
    />
    <Typography
      sx={{
        padding: '0.188rem 0.375rem',
      }}
      variant="labelSmMedium"
    >
      {label}
    </Typography>
  </Box>
);

export default ZUITargetGroupChip;
