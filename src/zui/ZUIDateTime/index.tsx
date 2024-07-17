import { FormattedDate, FormattedTime } from 'react-intl';

import convertDateTimeToLocal from './utils/convertDateTimeToLocal';

interface ZUIDateTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
}

const ZUIDateTime: React.FunctionComponent<ZUIDateTimeProps> = ({
  convertToLocal,
  datetime,
}) => {
  const value =
    (convertToLocal ? convertDateTimeToLocal(datetime) : datetime).replace(
      /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}).+/,
      '$1'
    ) + '.000Z';

  return (
    <>
      <FormattedDate day="numeric" month="long" value={value} year="numeric" />{' '}
      <FormattedTime value={value} />
    </>
  );
};

export default ZUIDateTime;
