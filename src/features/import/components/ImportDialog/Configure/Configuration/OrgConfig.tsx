import { FC, useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { OrgColumn } from 'features/import/types';
import OrgConfigRow from './OrgConfigRow';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import useGuessOrganization from 'features/import/hooks/useGuessOrganization';
import { useNumericRouteParams } from 'core/hooks';
import useOrgMapping from 'features/import/hooks/useOrgMapping';
import useSubOrganizations from 'features/organizations/hooks/useSubOrganizations';
import { Msg, useMessages } from 'core/i18n';

interface OrgConfigProps {
  uiDataColumn: UIDataColumn<OrgColumn>;
}

const OrgConfig: FC<OrgConfigProps> = ({ uiDataColumn }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const subOrgs = useSubOrganizations(orgId).data || [];
  const activeOrgs = subOrgs.filter((subOrg) => subOrg.is_active);
  const guessOrgs = useGuessOrganization(activeOrgs, uiDataColumn);
  const { deselectOrg, getSelectedOrgId, selectOrg } = useOrgMapping(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );
  const [scores, setScores] = useState<Record<string, number> | undefined>(
    undefined
  );

  if (!activeOrgs.length) {
    return null;
  }
  const org = activeOrgs.find((org) => org.id == orgId);

  const sortedActiveOrgs = activeOrgs
    .filter((org) => org.id != orgId)
    .sort((orgA, orgB) => {
      return orgA.title.localeCompare(orgB.title);
    });

  if (org) {
    sortedActiveOrgs.unshift(org);
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
            setScores(guessOrgs());
          }}
        >
          {messages.configuration.configure.orgs.guess()}
        </Button>
      </Box>

      <Box alignItems="center" display="flex" paddingY={2}>
        <Box flex={1}>
          <Typography variant="body2">
            {messages.configuration.configure.orgs.status().toLocaleUpperCase()}
          </Typography>
        </Box>
        <Box flex={1}>
          <Typography variant="body2">
            {messages.configuration.configure.orgs
              .organizations()
              .toLocaleUpperCase()}
          </Typography>
        </Box>
        {!!scores && (
          <Box width={50}>
            <Typography variant="body2">
              {messages.configuration.configure.orgs
                .score()
                .toLocaleUpperCase()}
            </Typography>
          </Box>
        )}
      </Box>
      {uiDataColumn.uniqueValues.map((uniqueValue, index) => (
        <Box key={index}>
          {index != 0 && <Divider sx={{ marginY: 1 }} />}
          <OrgConfigRow
            numRows={uiDataColumn.numRowsByUniqueValue[uniqueValue]}
            onDeselectOrg={() => deselectOrg(uniqueValue)}
            onSelectOrg={(orgId) => selectOrg(orgId, uniqueValue)}
            orgs={sortedActiveOrgs}
            scores={scores}
            selectedOrgId={getSelectedOrgId(uniqueValue)}
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
            onDeselectOrg={() => deselectOrg(null)}
            onSelectOrg={(orgId) => selectOrg(orgId, null)}
            orgs={activeOrgs}
            scores={scores}
            selectedOrgId={getSelectedOrgId(null)}
            title={messages.configuration.configure.tags.empty()}
          />
        </>
      )}
    </Box>
  );
};

export default OrgConfig;
