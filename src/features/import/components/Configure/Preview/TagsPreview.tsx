import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { useMessages } from 'core/i18n';
import { ZetkinTag } from 'utils/types/zetkin';
import { CellData, ColumnKind, Sheet } from 'features/import/utils/types';
interface TagPreviewProps {
  currentSheet: Sheet;
  tags: ZetkinTag[];
  personIndex: number;
}
const TagsPreview = ({ tags, currentSheet, personIndex }: TagPreviewProps) => {
  const messages = useMessages(messageIds);
  const tagColumnIndexesBeforeMapping = currentSheet.columns
    .map((item, index) =>
      item.kind === ColumnKind.TAG && item.selected && item.mapping.length === 0
        ? index
        : undefined
    )
    .filter((item) => item !== undefined);

  const tagRowValues: CellData[] = tagColumnIndexesBeforeMapping.map(
    (tagIndex) => currentSheet.rows[personIndex].data[tagIndex!]
  );

  return (
    <>
      {(tagRowValues.length > 0 || tags.length > 0) && (
        <PreviewGrid
          columnHeader={messages.configuration.preview.columnHeader.tags()}
          kind={ColumnKind.TAG}
          rowValues={tagRowValues}
          tags={tags}
        />
      )}
    </>
  );
};

export default TagsPreview;
