import { FormattedDate } from 'react-intl';

interface ZetkinDateProps {
  datetime: string; // iso datetime string
}

const ZetkinDate: React.FunctionComponent<ZetkinDateProps> = ({ datetime }) => {
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

export default ZetkinDate;
