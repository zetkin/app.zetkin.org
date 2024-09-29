import { Tooltip } from '@mui/material';
import { Box, Stack } from '@mui/system';

import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import ProceduralColorIcon from 'features/organizations/components/ProceduralColorIcon';
import { useMessages } from 'core/i18n';
import { ZetkinOrganization } from 'utils/types/zetkin';
import { ColumnKind, Sheet } from 'features/import/utils/types';

interface OrgsPreviewProps {
  currentSheet: Sheet;
  orgs: Pick<ZetkinOrganization, 'title' | 'id'>[] | [];
}

const OrgsPreview = ({ currentSheet, orgs }: OrgsPreviewProps) => {
  const messages = useMessages(messageIds);
  const hasMapped = currentSheet.columns.some(
    (column) =>
      column.kind === ColumnKind.ORGANIZATION && column.mapping.length > 0
  );

  return (
    <PreviewGrid
      columnHeader={messages.configuration.preview.columnHeader.org()}
      emptyLabel={
        hasMapped && orgs.length === 0
          ? messages.configuration.preview.noOrg()
          : ''
      }
      rowValue={
        orgs.length > 0 ? (
          <Stack direction="row" maxWidth={'300px'} mt="5px" spacing={1}>
            {orgs?.map((org) => (
              <Tooltip key={org.id} title={org.title}>
                <Box>
                  <ProceduralColorIcon id={org.id} />
                </Box>
              </Tooltip>
            ))}
          </Stack>
        ) : null
      }
      unmappedRow={!hasMapped}
    />
  );
};

export default OrgsPreview;
