import { ColumnKind } from 'features/import/utils/types';

interface RowValueProps {
  kind: ColumnKind;
}
const RowValue = ({ kind }) => {
  const columnIsOrg = kind === ColumnKind.ORGANIZATION;
  const columnIsTags = kind === ColumnKind.TAG;

  return <div>RowValue</div>;
};

export default RowValue;
