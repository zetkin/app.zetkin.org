import { Tooltip } from '@mui/material';
import { FormattedDate, FormattedTime } from 'react-intl';

interface ZUIDateTimeProps {
  convertToLocal?: boolean;
  datetime: string; // iso datetime string
}

const ZUIDateTime: React.FunctionComponent<ZUIDateTimeProps> = ({
  convertToLocal,
  datetime,
}) => {
  const value = convertToLocal ? new Date(datetime + 'Z') : datetime;
  return (
    <Tooltip
      arrow
      title={
        <>
          <FormattedDate
            day="numeric"
            month="long"
            value={value}
            year="numeric"
          />{' '}
          <FormattedTime value={value} />
        </>
      }
    >
      <>
        <FormattedDate
          day="numeric"
          month="long"
          value={value}
          year="numeric"
        />{' '}
        <FormattedTime value={value} />
      </>
    </Tooltip>
  );
};

export default ZUIDateTime;
