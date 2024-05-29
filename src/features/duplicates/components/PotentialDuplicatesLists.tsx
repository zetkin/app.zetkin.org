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
  const peopleToMerge: ZetkinPerson[] = potentialDuplicate?.duplicates || [];
  const [peopleNoToMerge, setPeopleNoToMerge] = useState<ZetkinPerson[]>([]);

  const handleChangeOfRows = (add: boolean, person: ZetkinPerson) => {
    if (add) {
      setPeopleNoToMerge([...peopleNoToMerge, person]);
    } else {
      const newRows = peopleNoToMerge.filter((row) => row.id !== person.id);
      setPeopleNoToMerge(newRows);
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

  const columnsNotBeingMerged: GridColDef[] = getColumns(
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
          rows={peopleToMerge}
        />
      </Box>
      {peopleNoToMerge.length > 0 && (
        <Box
          display="flex"
          flexDirection="column"
          overflow="hidden"
          padding={2}
        >
          <Typography variant="h6">
            {messages.modal.peopleNotBeingMerged()}
          </Typography>
          <DataGridPro
            autoHeight
            checkboxSelection={false}
            columns={columnsNotBeingMerged}
            disableRowSelectionOnClick
            hideFooter
            rows={peopleNoToMerge}
          />
        </Box>
      )}
    </>
  );
};

export default PotentialDuplicatesLists;
