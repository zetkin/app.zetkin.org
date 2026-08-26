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

  return (
    <>
      {format.dateTime(new Date(value), {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}{' '}
      {format.dateTime(new Date(value), {
        hour: 'numeric',
        minute: 'numeric',
      })}
    </>
  );
};

export default ZUIDateTime;
