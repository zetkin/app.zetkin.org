import dayjs from 'dayjs';
import { FormattedRelativeTime } from 'react-intl';
import { Tooltip } from '@material-ui/core';

import ZetkinDateTime from './ZetkinDateTime';

interface ZetkinRelativeTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
  forcePast?: boolean;
}

const ZetkinRelativeTime: React.FunctionComponent<ZetkinRelativeTimeProps> = ({
  convertToLocal,
  datetime,
  forcePast,
}) => {
  const now = dayjs();
  const absoluteDatetime = dayjs(
    convertToLocal ? new Date(datetime + 'Z') : datetime
  );

  //if forcePast is set and datetime is in the future, set time to "now"
  const difference: number =
    forcePast && absoluteDatetime.unix() - now.unix() > 0
      ? 0
      : absoluteDatetime.unix() - now.unix();

  if (isNaN(difference)) {
    return null;
  }

  return (
    <Tooltip
      arrow
      title={<ZetkinDateTime convertToLocal datetime={datetime} />}
    >
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
