import { GetServerSideProps } from 'next';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import CanvassAssignmentLayout from 'features/areas/layouts/CanvassAssignmentLayout';
import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import useCanvassSessions from 'features/areas/hooks/useCanvassSessions';
import { ZetkinCanvassSession } from 'features/areas/types';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import { useMessages } from 'core/i18n';
import messageIds from 'features/areas/l10n/messageIds';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { AREAS } from 'utils/featureFlags';

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

type CanvasserInfo = {
  id: number;
  person: ZetkinPerson;
  sessions: ZetkinCanvassSession[];
};

const CanvassAssignmentPage: PageWithLayout<Props> = ({
  orgId,
  canvassAssId,
}) => {
  const messages = useMessages(messageIds);
  const allSessions =
    useCanvassSessions(parseInt(orgId), canvassAssId).data || [];
  const sessions = allSessions.filter(
    (session) => session.assignment.id === canvassAssId
  );

  const sessionsByPersonId: Record<number, CanvasserInfo> = {};

  sessions.forEach((session) => {
    if (!sessionsByPersonId[session.assignee.id]) {
      sessionsByPersonId[session.assignee.id] = {
        id: session.assignee.id,
        person: session.assignee,
        sessions: [session],
      };
    } else {
      sessionsByPersonId[session.assignee.id].sessions.push(session);
    }
  });

  const canvassers = Object.values(sessionsByPersonId);

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
      headerName: messages.canvassAssignment.canvassers.nameColumn(),
      valueGetter: (params) =>
        `${params.row.person.first_name} ${params.row.person.last_name}`,
    },
    {
      align: 'left',
      field: 'areas',
      flex: 1,
      headerAlign: 'left',
      headerName: messages.canvassAssignment.canvassers.areasColumn(),
      type: 'number',
      valueGetter: (params) => params.row.sessions.length,
    },
  ];

  return (
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
  );
};

CanvassAssignmentPage.getLayout = function getLayout(page) {
  return (
    <CanvassAssignmentLayout {...page.props}>{page}</CanvassAssignmentLayout>
  );
};

export default CanvassAssignmentPage;
