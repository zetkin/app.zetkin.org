import { FC } from 'react';
import { Box, Button, FormControl, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import messageIds from '../l10n/messageIds';
import { PotentialDuplicate } from '../store';
import useDuplicatesMutations from '../hooks/useDuplicatesMutations';
import { useMessages } from 'core/i18n';
import useNotDuplicates from '../hooks/useNotDuplicates';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

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

  const rows: ZetkinPerson[] = notDuplicates || [];

  const columns: GridColDef[] = [
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'Name',
      headerName: messages.modal.possibleDuplicatesColumns.name(),
      minWidth: 250,
      renderCell: (params) => (
        <ZUIPersonHoverCard personId={params.row.id}>
          <ZUIPersonAvatar orgId={orgId} personId={params.row.id} />
          <Typography
            sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
          >
            {params.row.first_name + ' ' + params.row.last_name}
          </Typography>
        </ZUIPersonHoverCard>
      ),
    },
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'E-Mail',
      headerName: messages.modal.possibleDuplicatesColumns.email(),
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
        >
          {params.row.email}
        </Typography>
      ),
    },
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'phone',
      headerName: messages.modal.possibleDuplicatesColumns.phone(),
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
        >
          {params.row.phone}
        </Typography>
      ),
    },
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'button',
      headerName: '',
      minWidth: 250,
      renderCell: (params) => {
        return (
          <FormControl
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={() => addDuplicatePerson(duplicate.id, params.row)}
              size="small"
              variant="outlined"
            >
              {messages.modal.isDuplicateButton()}
            </Button>
          </FormControl>
        );
      },
    },
  ];

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
