import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

import { MetricResponse } from 'features/canvass/types';
import { ZetkinMetric } from 'features/areaAssignments/types';

export const METRIC_ICON_BORDER_RADIUS = 5; // px
export const METRIC_ICON_LARGE_SIZE = 30; // px
export const METRIC_ICON_SMALL_SIZE = 20; // px

type Props = {
  metric: ZetkinMetric;
  response: MetricResponse['response'] | null;
  variant: 'small' | 'large';
};

export const MetricIconIcon: FC<Props> = ({ metric, response, variant }) => {
  const theme = useTheme();
  const dark = metric.defines_success;

  const color =
    variant === 'large' || dark
      ? theme.palette.background.default
      : theme.palette.text.disabled;
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
> = (props) => {
  const { first, last, variant, metric } = props;
  const theme = useTheme();
  const dark = metric.defines_success;

  if (variant === 'large') {
    return (
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: dark
            ? theme.palette.secondary.main
            : theme.palette.grey[400],
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'row',
          height: `${METRIC_ICON_LARGE_SIZE}px`,
          justifyContent: 'center',
          width: `${METRIC_ICON_LARGE_SIZE}px`,
        }}
      >
        <MetricIconIcon {...props} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: dark
          ? theme.palette.secondary.main
          : theme.palette.grey[300],
        borderBottomLeftRadius: first ? `${METRIC_ICON_BORDER_RADIUS}px` : 0,
        borderBottomRightRadius: last ? `${METRIC_ICON_BORDER_RADIUS}px` : 0,
        borderTopLeftRadius: first ? `${METRIC_ICON_BORDER_RADIUS}px` : 0,
        borderTopRightRadius: last ? `${METRIC_ICON_BORDER_RADIUS}px` : 0,
        display: 'flex',
        flexDirection: 'row',
        height: `${METRIC_ICON_SMALL_SIZE}px`,
        justifyContent: 'center',
        width: `${METRIC_ICON_SMALL_SIZE}px`,
      }}
    >
      <MetricIconIcon {...props} />
    </Box>
  );
};
