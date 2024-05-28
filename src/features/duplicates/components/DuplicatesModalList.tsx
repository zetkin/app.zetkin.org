import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import getColumns from '../utils/getColumns';
import messageIds from '../l10n/messageIds';
import { PotentialDuplicate } from '../store';
import useDuplicatesMutations from '../hooks/useDuplicatesMutations';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';

interface DuplicatesModalListProps {
  duplicate: PotentialDuplicate;
}

const DuplicatesModalList: FC<DuplicatesModalListProps> = ({ duplicate }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { removeDuplicatePerson } = useDuplicatesMutations(orgId);
  const rows: ZetkinPerson[] = duplicate?.duplicates || [];
  const isPeopleToMergeTable = true;

  const columns: GridColDef[] = getColumns(
    removeDuplicatePerson,
    duplicate.id,
    isPeopleToMergeTable,
    messages,
    orgId
  );

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
      <Typography variant="h6">{messages.modal.peopleToMerge()}</Typography>

      <DataGridPro
        autoHeight
        checkboxSelection={false}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        rows={rows}
      />
    </Box>
  );
};

export default DuplicatesModalList;
