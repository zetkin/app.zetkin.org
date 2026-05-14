import dayjs from 'dayjs';
import { useFormatter } from 'next-intl';
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
  const format = useFormatter();
  const now = dayjs();
  const absoluteDatetime = dayjs(
    convertToLocal ? new Date(datetime + 'Z') : datetime
  );

  //if forcePast is set and datetime is in the future, set time to "now"
  const effectiveDate: Date =
    forcePast && absoluteDatetime.unix() - now.unix() > 0
      ? now.toDate()
      : absoluteDatetime.toDate();

  if (isNaN(effectiveDate.getTime())) {
    return null;
  }

  return (
    <Tooltip
      arrow
      title={
        <ZUIDateTime convertToLocal={convertToLocal} datetime={datetime} />
      }
    >
      <span>{format.relativeTime(effectiveDate)}</span>
    </Tooltip>
  );
};

export default ZUIRelativeTime;
