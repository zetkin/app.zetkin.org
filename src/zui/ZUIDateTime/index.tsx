import { useFormatter } from 'next-intl';

import convertDateTimeToLocal from './utils/convertDateTimeToLocal';

interface ZUIDateTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
}

const ZUIDateTime: React.FunctionComponent<ZUIDateTimeProps> = ({
  convertToLocal,
  datetime,
}) => {
  const format = useFormatter();
  const value = convertToLocal ? convertDateTimeToLocal(datetime) : datetime;
  const dateValue = new Date(value);

  return (
    <>
      {format.dateTime(dateValue, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}{' '}
      {format.dateTime(dateValue, { hour: 'numeric', minute: 'numeric' })}
    </>
  );
};

export default ZUIDateTime;
