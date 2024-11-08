import { Card } from '@mui/material';
import { GetServerSideProps } from 'next';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { AREAS } from 'utils/featureFlags';
import { CanvasserInfo } from 'features/canvassAssignments/types';
import useCanvassSessions from 'features/canvassAssignments/hooks/useCanvassSessions';
import CanvassAssignmentLayout from 'features/canvassAssignments/layouts/CanvassAssignmentLayout';
import getCanvassers from 'features/canvassAssignments/utils/getCanvassers';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [AREAS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, canvassAssId } = ctx.params!;
  return {
    props: { campId, canvassAssId, orgId },
  };
}, scaffoldOptions);

type Props = {
  canvassAssId: string;
  orgId: string;
};

const CanvassAssignmentPage: PageWithLayout<Props> = ({
  orgId,
  canvassAssId,
}) => {
  const allSessions =
    useCanvassSessions(parseInt(orgId), canvassAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === canvassAssId
  );

  const canvassers = getCanvassers(sessions);

  const columns: GridColDef<CanvasserInfo>[] = [
    {
      disableColumnMenu: true,
      field: 'id',
      headerName: ' ',
      renderCell: (params) => (
        <ZUIPersonHoverCard personId={params.row.person.id}>
          <ZUIAvatar
            size={'md'}
            url={`/api/orgs/${orgId}/people/${params.row.person.id}/avatar`}
          />
        </ZUIPersonHoverCard>
      ),
      sortable: false,
    },
    {
      field: 'name',
      flex: 1,
      headerName: 'Name',
      valueGetter: (params) =>
        `${params.row.person.first_name} ${params.row.person.last_name}`,
    },
    {
      align: 'left',
      field: 'areas',
      flex: 1,
      headerAlign: 'left',
      headerName: 'Areas',
      type: 'number',
      valueGetter: (params) => params.row.sessions.length,
    },
  ];

  return (
    <Card>
      <DataGridPro
        autoHeight
        columns={columns}
        disableColumnFilter
        disableColumnMenu
        disableColumnReorder
        disableColumnResize
        disableRowSelectionOnClick
        hideFooter
        rows={canvassers}
        style={{
          border: 'none',
        }}
      />
    </Card>
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
