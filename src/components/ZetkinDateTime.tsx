import { FormattedDate, FormattedTime } from 'react-intl';

interface ZetkinDateTimeProps {
  datetime: string; // iso datetime string
}

const ZetkinDateTime: React.FunctionComponent<ZetkinDateTimeProps> = ({
  datetime,
}) => {
  return (
    <>
      <FormattedDate
        day="numeric"
        month="long"
        value={datetime}
        year="numeric"
      />{' '}
      <FormattedTime value={datetime} />
    </>
  );
};

export default ZetkinDateTime;
