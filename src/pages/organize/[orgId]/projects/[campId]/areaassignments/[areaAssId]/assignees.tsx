import { Card } from '@mui/material';
import { GetServerSideProps } from 'next';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { AREAS } from 'utils/featureFlags';
import { AreaAssigneeInfo } from 'features/areaAssignments/types';
import useAreaAssignmentSessions from 'features/areaAssignments/hooks/useAreaAssignmentSessions';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import getAreaAssignees from 'features/areaAssignments/utils/getAreaAssignees';

const scaffoldOptions = {
  authLevelRequired: 2,
  featuresRequired: [AREAS],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId, campId, areaAssId } = ctx.params!;
  return {
    props: { areaAssId, campId, orgId },
  };
}, scaffoldOptions);

type Props = {
  areaAssId: string;
  orgId: string;
};

const AreaAssignmentPage: PageWithLayout<Props> = ({ orgId, areaAssId }) => {
  const allSessions =
    useAreaAssignmentSessions(parseInt(orgId), areaAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === areaAssId
  );

  const areaAssignees = getAreaAssignees(sessions);

  const columns: GridColDef<AreaAssigneeInfo>[] = [
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
        rows={areaAssignees}
        style={{
          border: 'none',
        }}
      />
    </Card>
  );
};

AreaAssignmentPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default AreaAssignmentPage;
