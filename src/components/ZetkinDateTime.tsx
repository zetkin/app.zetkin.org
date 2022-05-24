import { FormattedDate, FormattedTime } from 'react-intl';

interface ZetkinDateTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
}

const ZetkinDateTime: React.FunctionComponent<ZetkinDateTimeProps> = ({
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

export default ZetkinDateTime;
