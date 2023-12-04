import { Theme } from '@mui/system';
import { Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { ColumnKind, Sheet } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

interface OrgPreviewProps {
  currentSheet: Sheet;
  theme: Theme;
  org: Pick<ZetkinOrganization, 'title' | 'id'> | undefined;
}

const OrgPreview = ({ currentSheet, org, theme }: OrgPreviewProps) => {
  const messages = useMessages(messageIds);

  const hasMapped = currentSheet.columns.some(
    (column) =>
      column.kind === ColumnKind.ORGANIZATION && column.mapping.length > 0
  );
  const noOrg = (
    <Typography
      sx={{
        color: theme.palette.grey[400],
        fontStyle: 'italic',
      }}
    >
      (<Msg id={messageIds.configuration.preview.noOrgs} />)
    </Typography>
  );

  return (
    <PreviewGrid
      columnHeader={messages.configuration.preview.columnHeader.org()}
      rowValue={hasMapped ? (org ? org.title : noOrg) : null}
      unmappedRow={!hasMapped}
    />
  );
};

export default OrgPreview;
