import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { FC } from 'react';
import { Typography } from '@mui/material';

import { MetricResponse } from 'features/canvass/types';
import { ZetkinMetric } from 'features/areaAssignments/types';

type Props = {
  metric: ZetkinMetric;
  response: MetricResponse['response'] | null;
  size?: 'large' | 'medium' | 'small';
};

export const MetricIcon: FC<Props> = ({
  metric,
  response,
  size: optionalSize,
}) => {
  const size = optionalSize ?? 'small';

  if (response === null) {
    return <RemoveIcon color="disabled" fontSize={size} />;
  }

  if (metric.type === 'bool') {
    return response === 'yes' ? (
      <CheckIcon fontSize={size} />
    ) : (
      <CloseIcon fontSize={size} />
    );
  } else {
    return (
      <Typography fontSize={numericResponseFontSize(size)} mx="5px">
        {response}
      </Typography>
    );
  }
};

function numericResponseFontSize(size: 'large' | 'medium' | 'small') {
  if (size === 'small') {
    return 'medium';
  }

  return 'large';
}
