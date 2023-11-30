import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { Sheet } from 'features/import/utils/types';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import usePersonPreview from 'features/import/hooks/usePersonPreview';

interface FieldsPreviewProps {
  currentSheet: Sheet;
  fieldKey: string;
  personIndex: number;
}
const FieldsPreview = ({
  fieldKey,
  currentSheet,
  personIndex,
}: FieldsPreviewProps) => {
  const { orgId } = useNumericRouteParams();
  const columnOptions = useColumnOptions(orgId);
  const messages = useMessages(messageIds);
  const { fields } = usePersonPreview(currentSheet, personIndex);

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
      rowValue={value}
    />
  );
};

export default FieldsPreview;
