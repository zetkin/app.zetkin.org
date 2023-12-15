import { FormattedDate } from 'react-intl';

interface ZUIDateProps {
  datetime: string; // iso datetime string
}

const ZUIDate: React.FunctionComponent<ZUIDateProps> = ({ datetime }) => {
  return (
    <FormattedDate day="numeric" month="long" value={datetime} year="numeric" />
  );
};

export default ZUIDate;
