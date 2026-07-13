import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import useColumn from 'features/import/hooks/useColumn';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { CellData } from 'features/import/types';

interface FieldsPreviewProps {
  fieldKey: string;
  fields?: Record<string, CellData>;
}
const FieldsPreview = ({ fieldKey, fields }: FieldsPreviewProps) => {
  const { orgId } = useNumericRouteParams();
  const { fieldOptions: columnOptions } = useColumn(orgId);
  const messages = useMessages(messageIds);

  let fieldColumnHeader = '';
  columnOptions.flat().forEach((columnOp) => {
    if (columnOp.value === `field:${fieldKey}`) {
      fieldColumnHeader = columnOp.label;
    }
  });
  const fieldValue = fields?.[fieldKey];

  return (
    <PreviewGrid
      columnHeader={fieldColumnHeader}
      emptyLabel={!fieldValue ? messages.configuration.preview.noValue() : ''}
      rowValue={fieldValue || ''}
    />
  );
};

export default FieldsPreview;
