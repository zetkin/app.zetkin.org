import { Card } from '@mui/material';
import { GetServerSideProps } from 'next';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import Head from 'next/head';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { AREAS } from 'utils/featureFlags';
import { AreaAssigneeInfo } from 'features/areaAssignments/types';
import useAreaAssignmentSessions from 'features/areaAssignments/hooks/useAreaAssignmentSessions';
import AreaAssignmentLayout from 'features/areaAssignments/layouts/AreaAssignmentLayout';
import getAreaAssignees from 'features/areaAssignments/utils/getAreaAssignees';
import useAreaAssignment from 'features/areaAssignments/hooks/useAreaAssignment';
import { useMessages } from 'core/i18n';
import messageIds from 'features/areaAssignments/l10n/messageIds';

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
  const messages = useMessages(messageIds);
  const allSessions =
    useAreaAssignmentSessions(parseInt(orgId), areaAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === areaAssId
  );
  const areaAssignmentFuture = useAreaAssignment(parseInt(orgId), areaAssId);
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
      headerName: messages.assignees.columns.name(),
      valueGetter: (params) =>
        `${params.row.person.first_name} ${params.row.person.last_name}`,
    },
    {
      align: 'left',
      field: 'areas',
      flex: 1,
      headerAlign: 'left',
      headerName: messages.assignees.columns.areas(),
      type: 'number',
      valueGetter: (params) => params.row.sessions.length,
    },
  ];

  return (
    <>
      <Head>
        <title>{areaAssignmentFuture.data?.title}</title>
      </Head>
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
    </>
  );
};

AreaAssignmentPage.getLayout = function getLayout(page) {
  return <AreaAssignmentLayout {...page.props}>{page}</AreaAssignmentLayout>;
};

export default AreaAssignmentPage;
