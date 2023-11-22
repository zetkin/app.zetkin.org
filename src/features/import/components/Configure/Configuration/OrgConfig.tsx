import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { OrgColumn } from 'features/import/utils/types';
import OrgConfigRow from './OrgConfigRow';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumns';
import useOrganizations from 'features/organizations/hooks/useOrganizations';
import { Msg, useMessages } from 'core/i18n';

interface OrgConfigProps {
  uiDataColumn: UIDataColumn & { originalColumn: OrgColumn };
}

const OrgConfig: FC<OrgConfigProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);
  const organizations = useOrganizations();

  if (!organizations.data) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
      <Typography sx={{ paddingBottom: 2 }} variant="h5">
        <Msg id={messageIds.configuration.configure.orgs.header} />
      </Typography>
      <Box alignItems="center" display="flex" paddingY={2}>
        <Box width="50%">
          <Typography variant="body2">
            {messages.configuration.configure.orgs.status().toLocaleUpperCase()}
          </Typography>
        </Box>
        <Box width="50%">
          <Typography variant="body2">
            {messages.configuration.configure.orgs
              .organizations()
              .toLocaleUpperCase()}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ overflowY: 'scroll' }}>
        {uiDataColumn.uniqueValues.map((uniqueValue, index) => (
          <>
            {index != 0 && <Divider sx={{ marginY: 1 }} />}
            <OrgConfigRow
              numRows={uiDataColumn.numRowsByUniqueValue[uniqueValue]}
              onDeselectOrg={() => uiDataColumn.deselectOrg(uniqueValue)}
              onSelectOrg={(orgId) =>
                uiDataColumn.selectOrg(orgId, uniqueValue)
              }
              orgs={organizations.data || []}
              selectedOrgId={uiDataColumn.getSelectedOrgId(uniqueValue)}
              title={uniqueValue.toString()}
            />
          </>
        ))}
        {uiDataColumn.numberOfEmptyRows > 0 && (
          <>
            <Divider sx={{ marginY: 1 }} />
            <OrgConfigRow
              italic
              numRows={uiDataColumn.numberOfEmptyRows}
              onDeselectOrg={() => uiDataColumn.deselectOrg(null)}
              onSelectOrg={(orgId) => uiDataColumn.selectOrg(orgId, null)}
              orgs={organizations.data || []}
              selectedOrgId={uiDataColumn.getSelectedOrgId(null)}
              title={messages.configuration.configure.tags.empty()}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default OrgConfig;
