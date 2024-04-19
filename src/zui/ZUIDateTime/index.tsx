import convertDateTimeToLocal from './utils/convertDateTimeToLocal';
import { FormattedDate, FormattedTime } from 'react-intl';

interface ZUIDateTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
}

const ZUIDateTime: React.FunctionComponent<ZUIDateTimeProps> = ({
  convertToLocal,
  datetime,
}) => {
  const value = convertToLocal ? convertDateTimeToLocal(datetime) : datetime;

  return (
    <>
      <FormattedDate day="numeric" month="long" value={value} year="numeric" />{' '}
      <FormattedTime value={value} />
    </>
  );
};

export default ZUIDateTime;
