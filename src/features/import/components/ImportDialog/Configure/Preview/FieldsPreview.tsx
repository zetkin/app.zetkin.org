import globalMessageIds from 'core/i18n/globalMessageIds';
import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import useColumn from 'features/import/hooks/useColumn';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { CellData, ColumnKind } from 'features/import/utils/types';

interface FieldsPreviewProps {
  fieldKey: string | null;
  fields: Record<string, CellData> | undefined;
  kind: ColumnKind;
}
const FieldsPreview = ({ fieldKey, fields, kind }: FieldsPreviewProps) => {
  const { orgId } = useNumericRouteParams();
  const { columnOptions } = useColumn(orgId);
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);

  let idColumnHeader = '';

  if (kind === ColumnKind.ID_FIELD) {
    idColumnHeader =
      fieldKey === 'id'
        ? globalMessages.personFields.id()
        : fieldKey === 'ext_id'
        ? globalMessages.personFields.ext_id()
        : '';
  }

  let fieldColumnHeader = '';
  columnOptions.forEach((columnOp) => {
    if (columnOp.value === `field:${fieldKey}`) {
      fieldColumnHeader = columnOp.label;
    }
  });
  const fieldValue = fields?.[fieldKey!];
  return (
    <PreviewGrid
      columnHeader={idColumnHeader || fieldColumnHeader}
      emptyLabel={!fieldValue ? messages.configuration.preview.noValue() : ''}
      rowValue={(fieldKey === null && fields?.['null']) || fieldValue || ''}
    />
  );
};

export default FieldsPreview;
