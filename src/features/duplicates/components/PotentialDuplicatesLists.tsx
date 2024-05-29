import { Box, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { FC, useState } from 'react';

import getColumns from '../utils/getColumns';
import messageIds from '../l10n/messageIds';
import { PotentialDuplicate } from '../store';
import useDuplicatesMutations from '../hooks/useDuplicatesMutations';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';

interface PotentialDuplicatesListsProps {
  potentialDuplicate: PotentialDuplicate;
}

const PotentialDuplicatesLists: FC<PotentialDuplicatesListsProps> = ({
  potentialDuplicate,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const { addDuplicatePerson, removeDuplicatePerson } =
    useDuplicatesMutations(orgId);
  const rowsToMerge: ZetkinPerson[] = potentialDuplicate?.duplicates || [];
  const [rows, setRows] = useState<ZetkinPerson[]>([]);

  const handleChangeOfRows = (add: boolean, person: ZetkinPerson) => {
    if (add) {
      setRows([...rows, person]);
    } else {
      const newRows = rows.filter((row) => row.id !== person.id);
      setRows(newRows);
    }
  };

  const columnsToMerge: GridColDef[] = getColumns(
    removeDuplicatePerson,
    potentialDuplicate.id,
    handleChangeOfRows,
    true,
    messages,
    orgId
  );

  const columns: GridColDef[] = getColumns(
    addDuplicatePerson,
    potentialDuplicate.id,
    handleChangeOfRows,
    false,
    messages,
    orgId
  );

  return (
    <>
      <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
        <Typography variant="h6">{messages.modal.peopleToMerge()}</Typography>
        <DataGridPro
          autoHeight
          checkboxSelection={false}
          columns={columnsToMerge}
          disableRowSelectionOnClick
          hideFooter
          rows={rowsToMerge}
        />
      </Box>
      {rows.length > 0 && (
        <Box
          display="flex"
          flexDirection="column"
          overflow="hidden"
          padding={2}
        >
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
        </Box>
      )}
    </>
  );
};

export default PotentialDuplicatesLists;
