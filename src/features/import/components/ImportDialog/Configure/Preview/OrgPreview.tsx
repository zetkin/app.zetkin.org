import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { useMessages } from 'core/i18n';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { ColumnKind, Sheet } from 'features/import/utils/types';

interface OrgPreviewProps {
  currentSheet: Sheet;
  org: Pick<ZetkinOrganization, 'title' | 'id'> | undefined;
}

const OrgPreview = ({ currentSheet, org }: OrgPreviewProps) => {
  const messages = useMessages(messageIds);

  const hasMapped = currentSheet.columns.some(
    (column) =>
      column.kind === ColumnKind.ORGANIZATION && column.mapping.length > 0
  );

  return (
    <PreviewGrid
      columnHeader={messages.configuration.preview.columnHeader.org()}
      emptyLabel={
        hasMapped && !org ? messages.configuration.preview.noOrg() : ''
      }
      rowValue={hasMapped && org ? org.title : null}
      unmappedRow={!hasMapped}
    />
  );
};

export default OrgPreview;
