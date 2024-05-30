import { FC } from 'react';
import { Button, FormControl, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

interface ModalListProps {
  buttonLabel: string;
  onButtonClick: (person: ZetkinPerson) => void;
  rows: ZetkinPerson[];
}

const ModalListProps: FC<ModalListProps> = ({
  buttonLabel,
  onButtonClick,
  rows,
}) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();

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
              onClick={() => {
                onButtonClick(params.row);
              }}
              size="small"
              variant="outlined"
            >
              {buttonLabel}
            </Button>
          </FormControl>
        );
      },
      sortable: false,
    },
  ];

  return (
    <DataGridPro
      autoHeight
      checkboxSelection={false}
      columns={columns}
      disableRowSelectionOnClick
      hideFooter
      rows={rows}
    />
  );
};

export default ModalListProps;
