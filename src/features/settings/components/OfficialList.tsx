import { DataGridPro } from '@mui/x-data-grid-pro';
import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Button, FormControl, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import { useMessages } from 'core/i18n';
import useRolesMutations from '../hooks/useRolesMutations';
import { ZetkinOfficial } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

interface OfficialListProps {
  orgId: number;
  officialList: ZetkinOfficial[];
}

const OfficialList: FC<OfficialListProps> = ({ orgId, officialList }) => {
  const messages = useMessages(messageIds);
  const { addToAdmin, addToOrganizer, removeAccess } = useRolesMutations(orgId);
  const user = useCurrentUser();

  const columns: GridColDef[] = [
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'avatar',
      headerName: messages.administrators.columns.name(),
      hideSortIcons: true,
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
      resizable: true,
      sortable: false,
    },
    {
      disableColumnMenu: true,
      field: 'role',
      flex: 1,
      headerName: messages.administrators.columns.inheritance(),
      renderCell: (params) => (
        <Typography
          sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
        >
          {params.row.role}
        </Typography>
      ),
      resizable: false,
      sortingOrder: ['asc', 'desc', null],
    },
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'cancel',
      flex: 1,
      headerName: '',
      minWidth: 300,
      renderCell: (params) => {
        if (params.row.id === user?.id) {
          return <Typography>{messages.you()}</Typography>;
        } else if (params.row.role === 'admin') {
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
                onClick={() => addToOrganizer(params.row.id)}
                size="small"
              >
                <ArrowDownward />
                {messages.tableButtons.demote()}
              </Button>
              <Button
                onClick={() => removeAccess(params.row.id)}
                size="small"
                variant="outlined"
              >
                {messages.tableButtons.remove()}
              </Button>
            </FormControl>
          );
        } else {
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
                onClick={() => addToAdmin(params.row.id)}
                size="small"
                startIcon={<ArrowUpward />}
              >
                {messages.tableButtons.promote()}
              </Button>
              <Button
                onClick={() => removeAccess(params.row.id)}
                size="small"
                variant="outlined"
              >
                {messages.tableButtons.remove()}
              </Button>
            </FormControl>
          );
        }
      },
    },
  ];

  return (
    <DataGridPro
      autoHeight
      checkboxSelection={false}
      columns={columns}
      rows={officialList}
    />
  );
};

export default OfficialList;
