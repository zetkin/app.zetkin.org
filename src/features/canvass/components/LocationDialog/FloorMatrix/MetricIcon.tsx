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
};

export const MetricIcon: FC<Props> = ({ metric, response }) => {
  if (response === null) {
    return <RemoveIcon color="disabled" fontSize="small" />;
  }

  if (metric.type === 'bool') {
    return response === 'yes' ? (
      <CheckIcon fontSize="small" />
    ) : (
      <CloseIcon fontSize="small" />
    );
  } else {
    return (
      <Typography fontSize="medium" mx="5px">
        {response}
      </Typography>
    );
  }
};
