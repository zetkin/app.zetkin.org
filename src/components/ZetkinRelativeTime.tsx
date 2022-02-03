import dayjs from 'dayjs';
import { FormattedRelativeTime } from 'react-intl';
import { Tooltip } from '@material-ui/core';

import ZetkinDateTime from './ZetkinDateTime';

interface ZetkinRelativeTimeProps {
  datetime: string; // iso datetime string
}

const ZetkinRelativeTime: React.FunctionComponent<ZetkinRelativeTimeProps> = ({
  datetime,
}) => {
  const now = dayjs();
  const absoluteDatetime = dayjs(datetime);
  const difference: number = absoluteDatetime.unix() - now.unix();

  if (isNaN(difference)) {
    return null;
  }

  return (
    <Tooltip arrow title={<ZetkinDateTime datetime={datetime} />}>
      <span>
        <FormattedRelativeTime
          numeric="auto"
          updateIntervalInSeconds={60}
          value={difference}
        />
      </span>
    </Tooltip>
  );
};

export default ZetkinRelativeTime;
