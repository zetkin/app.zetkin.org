import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { useMessages } from 'core/i18n';
import { ZetkinTag } from 'utils/types/zetkin';
import { ColumnKind, Sheet } from 'features/import/utils/types';
interface TagPreviewProps {
  currentSheet: Sheet;
  tags: ZetkinTag[];
}
const TagsPreview = ({ tags, currentSheet }: TagPreviewProps) => {
  const messages = useMessages(messageIds);
  const tagColumnSelected = currentSheet.columns.some(
    (column) => column.kind === ColumnKind.TAG && column.selected
  );
  const hasMapped = currentSheet.columns.some(
    (column) =>
      column.kind === ColumnKind.TAG &&
      column.selected &&
      column.mapping.length > 0
  );

  return (
    <>
      {tagColumnSelected && (
        <PreviewGrid
          columnHeader={messages.configuration.preview.columnHeader.tags()}
          hasMapped={hasMapped}
          kind={ColumnKind.TAG}
          tags={tags}
        />
      )}
    </>
  );
};

export default TagsPreview;
