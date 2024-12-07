import { FC } from 'react';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Button, FormControl, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import messageIds from '../l10n/messageIds';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import useMemberships from 'features/organizations/hooks/useMemberships';
import { useMessages } from 'core/i18n';
import useOfficialMutations from '../hooks/useOfficialMutations';
import useOrganization from 'features/organizations/hooks/useOrganization';
import { ZetkinMembership } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';

interface OfficialListProps {
  orgId: number;
  officialList: ZetkinMembership[];
}

const OfficialList: FC<OfficialListProps> = ({ orgId, officialList }) => {
  const messages = useMessages(messageIds);
  const { removeAccess, updateRole } = useOfficialMutations(orgId);
  const user = useCurrentUser();
  const parentOrg = useOrganization(orgId);
  const userMemberships = useMemberships();
  const sortedOfficialList = [...officialList].sort((a, b) => {
    if (a.profile.id === user?.id) {
      return -1;
    }
    if (b.profile.id === user?.id) {
      return 1;
    }
    return a.profile.name.localeCompare(b.profile.name);
  });

  const columns: GridColDef[] = [
    {
      align: 'left',
      disableColumnMenu: true,
      field: 'avatar',
      minWidth: 250,
      renderCell: (params) => (
        <ZUIPersonHoverCard personId={params.row.profile.id}>
          <ZUIPersonAvatar orgId={orgId} personId={params.row.profile.id} />
          <Typography
            sx={{ alignItems: 'center', display: 'inline-flex', marginLeft: 2 }}
          >
            {params.row.profile.name}
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
      renderCell: (params) => {
        if (params.row.inherited) {
          return (
            <Typography
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
                marginLeft: 2,
              }}
            >
              {params.row.role === 'admin'
                ? messages.officials.administrators.roleInheritance()
                : messages.officials.organizers.roleInheritance()}{' '}
              {parentOrg.data?.parent?.title}
            </Typography>
          );
        } else {
          return '';
        }
      },
      resizable: false,
      sortable: false,
    },
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'cancel',
      flex: 1,
      minWidth: 300,
      renderCell: (params) => {
        const matchingMembership = userMemberships.data?.find(
          (membership) => membership.organization.id === orgId
        );
        if (params.row.profile.id === matchingMembership?.profile.id) {
          return <Typography>{messages.officials.you()}</Typography>;
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
                disabled={params.row.inherited ? true : false}
                onClick={() => updateRole(params.row.id, 'organizer')}
                size="small"
                startIcon={<ArrowDownward />}
              >
                {messages.officials.tableButtons.demote()}
              </Button>
              <Button
                disabled={params.row.inherited ? true : false}
                onClick={() => removeAccess(params.row.id)}
                size="small"
                variant="outlined"
              >
                {messages.officials.tableButtons.remove()}
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
                onClick={() => updateRole(params.row.id, 'admin')}
                size="small"
                startIcon={<ArrowUpward />}
              >
                {messages.officials.tableButtons.promote()}
              </Button>
              <Button
                disabled={params.row.inherited ? true : false}
                onClick={() => removeAccess(params.row.id)}
                size="small"
                variant="outlined"
              >
                {messages.officials.tableButtons.remove()}
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
      disableRowSelectionOnClick
      hideFooter
      rows={sortedOfficialList || []}
      slots={{
        columnHeaders: () => null,
      }}
      sx={{ backgroundColor: 'white' }}
    />
  );
};

export default OfficialList;
