import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import Looks1Icon from '@mui/icons-material/LooksOne';
import Looks2Icon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import { FC } from 'react';
import { Typography, useTheme } from '@mui/material';

import { MetricResponse } from 'features/canvass/types';
import { ZetkinMetric } from 'features/areaAssignments/types';

const RATING_ICONS = {
  1: Looks1Icon,
  2: Looks2Icon,
  3: Looks3Icon,
  4: Looks4Icon,
  5: Looks5Icon,
};

type Props = {
  iconRatings?: boolean;
  metric: ZetkinMetric;
  response: MetricResponse['response'] | null;
  size?: 'large' | 'medium' | 'small';
};

export const MetricIcon: FC<Props> = ({
  iconRatings,
  metric,
  response,
  size: optionalSize,
}) => {
  const theme = useTheme();
  const size = optionalSize ?? 'small';

  if (response === null) {
    return <RemoveIcon color="disabled" fontSize={size} />;
  }

  if (metric.type === 'bool') {
    return response === 'yes' ? (
      <CheckIcon color="success" fontSize={size} />
    ) : (
      <CloseIcon color="error" fontSize={size} />
    );
  } else if (!iconRatings || typeof response === 'string') {
    return (
      <Typography
        color={theme.palette.grey[600]}
        fontSize="0.9rem"
        fontWeight="bold"
        mx="5px"
      >
        {response}
      </Typography>
    );
  } else {
    const Icon = RATING_ICONS[response];
    if (!Icon) {
      return null;
    }

    return (
      <Icon
        fontSize={size}
        sx={{
          color: theme.palette.grey[600],
        }}
      />
    );
  }
};
