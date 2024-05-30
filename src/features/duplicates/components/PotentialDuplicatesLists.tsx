import { FC } from 'react';
import { Box, Button, FormControl, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

interface PotentialDuplicatesListsProps {
  onDeselect: (person: ZetkinPerson) => void;
  onSelect: (person: ZetkinPerson) => void;
  peopleNoToMerge: ZetkinPerson[];
  peopleToMerge: ZetkinPerson[];
}

const PotentialDuplicatesLists: FC<PotentialDuplicatesListsProps> = ({
  onDeselect,
  onSelect,
  peopleNoToMerge,
  peopleToMerge,
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
                onDeselect(params.row);
              }}
              size="small"
              variant="outlined"
            >
              {messages.modal.notDuplicateButton()}
            </Button>
          </FormControl>
        );
      },
      sortable: false,
    },
  ];

  const columnsNoToMerge: GridColDef[] = [
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
                onSelect(params.row);
              }}
              size="small"
              variant="outlined"
            >
              {messages.modal.isDuplicateButton()}
            </Button>
          </FormControl>
        );
      },
      sortable: false,
    },
  ];

  return (
    <>
      <Box display="flex" flexDirection="column" overflow="hidden" padding={2}>
        <Typography variant="h6">{messages.modal.peopleToMerge()}</Typography>
        <DataGridPro
          autoHeight
          checkboxSelection={false}
          columns={columns}
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
            columns={columnsNoToMerge}
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
