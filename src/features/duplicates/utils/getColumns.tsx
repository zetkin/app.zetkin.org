import { GridColDef } from '@mui/x-data-grid-pro';
import { Button, FormControl, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { UseMessagesMap } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

function getColumns(
  buttonAction: (duplicateId: number, person: ZetkinPerson) => void,
  duplicateId: number,
  isPeopleToMergeTable: boolean,
  messages: UseMessagesMap<typeof messageIds>,
  orgId: number
) {
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
      sortable: false,
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

      sortable: false,
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
      sortable: false,
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
              onClick={() => buttonAction(duplicateId, params.row)}
              size="small"
              variant="outlined"
            >
              {isPeopleToMergeTable
                ? messages.modal.notDuplicateButton()
                : messages.modal.isDuplicateButton()}
            </Button>
          </FormControl>
        );
      },
      sortable: false,
    },
  ];

  return columns;
}

export default getColumns;
