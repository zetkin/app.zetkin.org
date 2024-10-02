import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { useMessages } from 'core/i18n';
import { EnumChoice, ZetkinOrganization } from 'utils/types/zetkin';
import { CellData, ColumnKind, Sheet } from 'features/import/utils/types';
import useColumn from 'features/import/hooks/useColumn';
import { useNumericRouteParams } from 'core/hooks';

interface EnumPreviewProps {
  currentSheet: Sheet;
  fieldKey: string;
  fields: Record<string, CellData> | undefined;
}

const EnumPreview = ({ currentSheet, fieldKey, fields }: EnumPreviewProps) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const { fieldOptions } = useColumn(orgId);

  const hasMapped = currentSheet.columns.some(
    (column) =>
      column.kind === ColumnKind.ENUM &&
      column.field === fieldKey &&
      column.mapping.length > 0
  );

  let columnHeader = '';
  let enumOptions: EnumChoice[] | undefined = [];
  fieldOptions.flat().forEach((columnOp) => {
    if (columnOp.value === `enum:${fieldKey}`) {
      columnHeader = columnOp.label;
      enumOptions = columnOp.enumChoices;
    }
  });

  const value = fields?.[fieldKey];
  const option = enumOptions.find((o) => o.key == value);

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
