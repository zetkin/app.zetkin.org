import { FC } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { OrgColumn } from 'features/import/utils/types';
import OrgConfigRow from './OrgConfigRow';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumns';
import useGuessOrganisaion from 'features/import/hooks/useGuessOrganisation';
import { useNumericRouteParams } from 'core/hooks';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { Msg, useMessages } from 'core/i18n';

interface OrgConfigProps {
  uiDataColumn: UIDataColumn<OrgColumn>;
}

const OrgConfig: FC<OrgConfigProps> = ({ uiDataColumn }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const guessOrgs = useGuessOrganisaion(orgId, uiDataColumn);
  const subOrgs = useSubOrganizations(orgId).data || [];
  const activeOrgs = subOrgs.filter((subOrg) => subOrg.is_active);

  if (!activeOrgs.length) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      overflow="hidden"
      padding={2}
      sx={{ overflowY: 'auto' }}
    >
      <Box alignItems="baseline" display="flex" justifyContent="space-between">
        <Typography sx={{ paddingBottom: 2 }} variant="h5">
          <Msg id={messageIds.configuration.configure.orgs.header} />
        </Typography>
        <Button
          onClick={() => {
            guessOrgs();
          }}
        >
          {messages.configuration.configure.orgs.guess().toLocaleUpperCase()}
        </Button>
      </Box>

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
      {uiDataColumn.uniqueValues.map((uniqueValue, index) => (
        <Box key={index}>
          {index != 0 && <Divider sx={{ marginY: 1 }} />}
          <OrgConfigRow
            numRows={uiDataColumn.numRowsByUniqueValue[uniqueValue]}
            onDeselectOrg={() => uiDataColumn.deselectOrg(uniqueValue)}
            onSelectOrg={(orgId) => uiDataColumn.selectOrg(orgId, uniqueValue)}
            orgs={activeOrgs}
            selectedOrgId={uiDataColumn.getSelectedOrgId(uniqueValue)}
            title={uniqueValue.toString()}
          />
        </Box>
      ))}
      {uiDataColumn.numberOfEmptyRows > 0 && (
        <>
          <Divider sx={{ marginY: 1 }} />
          <OrgConfigRow
            italic
            numRows={uiDataColumn.numberOfEmptyRows}
            onDeselectOrg={() => uiDataColumn.deselectOrg(null)}
            onSelectOrg={(orgId) => uiDataColumn.selectOrg(orgId, null)}
            orgs={activeOrgs}
            selectedOrgId={uiDataColumn.getSelectedOrgId(null)}
            title={messages.configuration.configure.tags.empty()}
          />
        </>
      )}
    </Box>
  );
};

export default OrgConfig;
