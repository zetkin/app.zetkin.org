import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { CellData, ColumnKind } from 'features/import/utils/types';

interface FieldsPreviewProps {
  fieldKey: string;
  fields: Record<string, CellData> | undefined;
}
const FieldsPreview = ({ fieldKey, fields }: FieldsPreviewProps) => {
  const { orgId } = useNumericRouteParams();
  const columnOptions = useColumnOptions(orgId);
  const messages = useMessages(messageIds);

  const value = fields?.[fieldKey];

  const idColumnHeader =
    fieldKey === 'id'
      ? messages.configuration.preview.columnHeader.int()
      : fieldKey === 'ext_id'
      ? messages.configuration.preview.columnHeader.ext()
      : '';

  let fieldColumnHeader = '';
  columnOptions.forEach((columnOp) => {
    if (columnOp.value === `field:${fieldKey}`) {
      fieldColumnHeader = columnOp.label;
    }
  });
  return (
    <PreviewGrid
      columnHeader={idColumnHeader || fieldColumnHeader}
      kind={ColumnKind.FIELD}
      rowValues={[value ?? '']}
    />
  );
};

export default FieldsPreview;
