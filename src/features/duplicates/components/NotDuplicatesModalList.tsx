import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import getColumns from '../utils/getColumns';
import messageIds from '../l10n/messageIds';
import { PotentialDuplicate } from '../store';
import useDuplicatesMutations from '../hooks/useDuplicatesMutations';
import { useMessages } from 'core/i18n';
import useNotDuplicates from '../hooks/useNotDuplicates';
import { useNumericRouteParams } from 'core/hooks';

interface NotDuplicatesModalListProps {
  duplicate: PotentialDuplicate;
}

const NotDuplicatesModalList: FC<NotDuplicatesModalListProps> = ({
  duplicate,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { addDuplicatePerson } = useDuplicatesMutations(orgId);

  const notDuplicates = useNotDuplicates();
  const rows = notDuplicates;
  const isPeopleToMergeTable = false;

  const columns: GridColDef[] = getColumns(
    addDuplicatePerson,
    duplicate.id,
    isPeopleToMergeTable,
    messages,
    orgId
  );

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
      {rows.length > 0 && (
        <>
          <Typography variant="h6">
            {messages.modal.peopleNotBeingMerge()}
          </Typography>
          <DataGridPro
            autoHeight
            checkboxSelection={false}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
            rows={rows}
          />
        </>
      )}
    </Box>
  );
};

export default NotDuplicatesModalList;
