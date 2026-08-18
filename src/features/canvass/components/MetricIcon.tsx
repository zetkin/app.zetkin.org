import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

import { MetricResponse } from 'features/canvass/types';
import { ZetkinMetric } from 'features/areaAssignments/types';

const BORDER_RADIUS = '5px';

type Props = {
  metric: ZetkinMetric;
  response: MetricResponse['response'] | null;
  variant: 'small' | 'large';
};

export const MetricIconIcon: FC<Props> = ({ metric, response, variant }) => {
  const theme = useTheme();

  const color =
    variant === 'small'
      ? theme.palette.text.disabled
      : theme.palette.background.default;
  const iconSize = variant === 'small' ? 'small' : 'medium';
  const iconStyle: SxProps<Theme> = { color };

  if (response === null) {
    return <RemoveIcon fontSize={iconSize} sx={iconStyle} />;
  }

  if (metric.type === 'bool') {
    return response === 'yes' ? (
      <CheckIcon fontSize={iconSize} sx={iconStyle} />
    ) : (
      <CloseIcon fontSize={iconSize} sx={iconStyle} />
    );
  } else {
    return (
      <Typography
        color={color}
        fontSize={variant === 'small' ? '0.9rem' : '1.2rem'}
        fontWeight="bold"
        mx="5px"
      >
        {response}
      </Typography>
    );
  }
};

export const MetricIcon: FC<
  Props & {
    first?: boolean;
    last?: boolean;
  }
> = ({ first, last, variant, ...props }) => {
  const theme = useTheme();

  if (variant === 'large') {
    return (
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: theme.palette.grey[400],
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'row',
          height: '30px',
          justifyContent: 'center',
          width: '30px',
        }}
      >
        <MetricIconIcon variant={variant} {...props} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: theme.palette.grey[300],
        borderBottomLeftRadius: first ? BORDER_RADIUS : 0,
        borderBottomRightRadius: last ? BORDER_RADIUS : 0,
        borderTopLeftRadius: first ? BORDER_RADIUS : 0,
        borderTopRightRadius: last ? BORDER_RADIUS : 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '20px',
      }}
    >
      <MetricIconIcon variant={variant} {...props} />
    </Box>
  );
};
