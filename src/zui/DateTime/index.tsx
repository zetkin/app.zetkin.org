import { FormattedDate, FormattedTime } from 'react-intl';

interface DateTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
}

const DateTime: React.FunctionComponent<DateTimeProps> = ({
  convertToLocal,
  datetime,
}) => {
  const value = convertToLocal ? new Date(datetime + 'Z') : datetime;
  return (
    <>
      <FormattedDate day="numeric" month="long" value={value} year="numeric" />{' '}
      <FormattedTime value={value} />
    </>
  );
};

export default DateTime;
