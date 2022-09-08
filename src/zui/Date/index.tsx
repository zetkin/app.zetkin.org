import { FormattedDate } from 'react-intl';

interface DateProps {
  datetime: string; // iso datetime string
}

const Date: React.FunctionComponent<DateProps> = ({ datetime }) => {
  return (
    <>
      <FormattedDate
        day="numeric"
        month="long"
        value={datetime}
        year="numeric"
      />
    </>
  );
};

export default Date;
