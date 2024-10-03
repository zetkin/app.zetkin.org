import dayjs from 'dayjs';
import { FormattedRelativeTime } from 'react-intl';
import { RelativeTimeFormatSingularUnit } from '@formatjs/ecma402-abstract';
import { Tooltip } from '@mui/material';

import ZUIDateTime from '../ZUIDateTime';

interface ZUIRelativeTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
  forcePast?: boolean;
}

const ZUIRelativeTime: React.FunctionComponent<ZUIRelativeTimeProps> = ({
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
      : absoluteDatetime.$d.getHours() === 0 && absoluteDatetime.$d.getMinutes() === 0 // "Midnight check"
        ? absoluteDatetime.unix() - now.startOf("day").unix() // Patch for midnight case (00:00). See issue #2199
        : absoluteDatetime.unix() - now.unix();

  if (isNaN(difference)) {
    return null;
  }

  const [value, unit, updateInterval] = selectUnit(difference);

  return (
    <Tooltip
      arrow
      title={
        <ZUIDateTime convertToLocal={convertToLocal} datetime={datetime} />
      }
    >
      <span>
        <FormattedRelativeTime
          numeric="auto"
          unit={unit}
          updateIntervalInSeconds={updateInterval}
          value={value}
        />
      </span>
    </Tooltip>
  );
};

function selectUnit(
  seconds: number
): [number, RelativeTimeFormatSingularUnit | undefined, number | undefined] {
  let value = seconds;
  let updateInterval: number | undefined = 60;
  let unit: RelativeTimeFormatSingularUnit | undefined = undefined;

  const yearInSeconds = 365 * 24 * 60 * 60;
  if (Math.abs(value) > 1.5 * yearInSeconds) {
    value = Math.round(value / yearInSeconds);
    unit = 'year';
    updateInterval = undefined;
  }

  return [value, unit, updateInterval];
}

export default ZUIRelativeTime;
