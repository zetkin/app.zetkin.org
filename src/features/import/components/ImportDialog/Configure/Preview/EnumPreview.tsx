import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { useMessages } from 'core/i18n';
import { CellData, ColumnKind, Sheet } from 'features/import/utils/types';
import useColumn from 'features/import/hooks/useColumn';
import { useNumericRouteParams } from 'core/hooks';
import useCustomFields from 'features/profile/hooks/useCustomFields';

interface EnumPreviewProps {
  currentSheet: Sheet;
  fieldKey: string;
  fields: Record<string, CellData> | undefined;
}

const EnumPreview = ({ currentSheet, fieldKey, fields }: EnumPreviewProps) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const { fieldOptions } = useColumn(orgId);
  const customFields = useCustomFields(orgId).data ?? [];

  const hasMapped = currentSheet.columns.some(
    (column) => column.kind === ColumnKind.ENUM && column.mapping.length > 0
  );

  let columnHeader = '';
  fieldOptions.flat().forEach((columnOp) => {
    if (columnOp.value === `enum:${fieldKey}`) {
      columnHeader = columnOp.label;
    }
  });

  const field = customFields.find((f) => f.slug === fieldKey);
  const enumChoices = field?.enum_choices || [];

  const enumKey = fields?.[fieldKey];

  const option = enumChoices.find((o) => o.key === enumKey);

  return (
    <PreviewGrid
      columnHeader={columnHeader}
      emptyLabel={
        hasMapped && !option ? messages.configuration.preview.noValue() : ''
      }
      rowValue={hasMapped && option ? option.label : null}
      unmappedRow={!hasMapped}
    />
  );
};

export default EnumPreview;
