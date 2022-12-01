import { GetServerSideProps } from 'next';
import { Avatar, Box, Paper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import useModel from 'core/useModel';
import { DataGridPro, GridColDef, GridRowData } from '@mui/x-data-grid-pro';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, campId, callAssId } = ctx.params!;

    return {
      props: {
        assignmentId: callAssId,
        campId,
        orgId,
      },
    };
  },
  {
    authLevelRequired: 2,
    localeScope: [
      'misc.breadcrumbs',
      'layout.organize.callAssignment',
      'pages.organizeCallAssignment',
    ],
  }
);

interface AssignmentPageProps {
  assignmentId: string;
  campId: string;
  orgId: string;
}

const AssignmentPage: PageWithLayout<AssignmentPageProps> = ({
  orgId,
  assignmentId,
}) => {
  const [onServer, setOnServer] = useState(true);
  const model = useModel(
    (store) =>
      new CallAssignmentModel(store, parseInt(orgId), parseInt(assignmentId))
  );

  useEffect(() => setOnServer(false), []);

  if (onServer) {
    return null;
  }

  const callers = model.getCallers();

  // Columns
  const columns: GridColDef[] = [
    {
      disableColumnMenu: true,
      field: 'id',
      headerName: ' ',
      renderCell: (params) => (
        <Avatar src={`/api/orgs/${orgId}/people/${params.id}/avatar`} />
      ),
      sortable: false,
      width: 50,
    },
    {
      field: 'name',
      flex: 1,
      headerName: 'Name',
    },
  ];

  const rows: GridRowData[] = Array.from(
    callers.map((caller) => ({
      id: caller.id,
      name: `${caller.first_name} ${caller.last_name}`,
    }))
  );

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Callers</Typography>
          <DataGridPro
            autoHeight
            columns={columns}
            disableColumnReorder
            disableColumnResize
            rows={rows}
            style={{
              border: 'none',
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

AssignmentPage.getLayout = function getLayout(page, props) {
  return (
    <CallAssignmentLayout
      assignmentId={props.assignmentId}
      campaignId={props.campId}
      orgId={props.orgId}
    >
      {page}
    </CallAssignmentLayout>
  );
};

export default AssignmentPage;
