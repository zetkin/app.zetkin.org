import { useFormatter } from 'next-intl';

interface ZUIDateProps {
  datetime: string; // iso datetime string
}

const ZUIDate: React.FunctionComponent<ZUIDateProps> = ({ datetime }) => {
  const format = useFormatter();
  return (
    <>
      {format.dateTime(new Date(datetime), { day: 'numeric', month: 'long', year: 'numeric' })}
    </>
  );
};

export default ZUIDate;
