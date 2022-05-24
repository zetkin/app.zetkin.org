import { FormattedDate, FormattedTime } from 'react-intl';

interface ZetkinDateTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
}

const ZetkinDateTime: React.FunctionComponent<ZetkinDateTimeProps> = ({
  convertToLocal,
  datetime,
}) => {
  return (
    <>
      <FormattedDate
        day="numeric"
        month="long"
        value={convertToLocal ? new Date(datetime + 'Z') : datetime}
        year="numeric"
      />{' '}
      <FormattedTime
        value={convertToLocal ? new Date(datetime + 'Z') : datetime}
      />
    </>
  );
};

export default ZetkinDateTime;
