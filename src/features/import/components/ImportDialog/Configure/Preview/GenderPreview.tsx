import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { useMessages } from 'core/i18n';
import { CellData, ColumnKind, Sheet } from 'features/import/utils/types';

interface GenderPreviewProps {
  currentSheet: Sheet;
  fieldKey: string;
  fields: Record<string, CellData> | undefined;
}

const GenderPreview = ({
  currentSheet,
  fieldKey,
  fields,
}: GenderPreviewProps) => {
  const messages = useMessages(messageIds);

  const map = currentSheet.columns.find(
    (column) => column.kind === ColumnKind.GENDER && column.mapping.length > 0
  );

  if (!map || map.kind !== ColumnKind.GENDER) {
    return (
      <PreviewGrid columnHeader={'Gender'} rowValue={null} unmappedRow={true} />
    );
  }

  const value = fields?.[fieldKey];
  if (value !== 'm' && value !== 'f' && value !== 'o' && value !== 'null') {
    return (
      <PreviewGrid
        columnHeader={messages.configuration.preview.columnHeader.gender()}
        emptyLabel={messages.configuration.preview.noValue()}
        rowValue={null}
        unmappedRow={false}
      />
    );
  }
  return (
    <PreviewGrid
      columnHeader={'Gender'}
      rowValue={messages.configuration.preview.genders[value]()}
      unmappedRow={false}
    />
  );
};

export default GenderPreview;
