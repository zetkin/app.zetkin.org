import { GetServerSideProps } from 'next';
import { Avatar, Box, Paper, Typography } from '@material-ui/core';
import { DataGridPro, GridColDef, GridRowData } from '@mui/x-data-grid-pro';
import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { useEffect, useState } from 'react';

import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import CallAssignmentModel from 'features/callAssignments/models/CallAssignmentModel';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import TagChip from 'features/tags/components/TagManager/components/TagChip';
import useModel from 'core/useModel';
import { ZetkinTag } from 'utils/types/zetkin';

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
  const intl = useIntl();

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
    },
    {
      field: 'name',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeCallAssignment.callers.nameColumn',
      }),
    },
    {
      field: 'prioritizedTags',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeCallAssignment.callers.prioritizedTagsColumn',
      }),
      renderCell: (props) =>
        props.row.prioritizedTags.map((tag: ZetkinTag) => (
          <TagChip key={tag.id} tag={tag} />
        )),
    },
    {
      field: 'excludedTags',
      flex: 1,
      headerName: intl.formatMessage({
        id: 'pages.organizeCallAssignment.callers.excludedTagsColumn',
      }),
      renderCell: (props) =>
        props.row.excludedTags.map((tag: ZetkinTag) => (
          <TagChip key={tag.id} tag={tag} />
        )),
    },
  ];

  const rows: GridRowData[] = Array.from(
    callers.map((caller) => ({
      excludedTags: caller.excluded_tags,
      id: caller.id,
      name: `${caller.first_name} ${caller.last_name}`,
      prioritizedTags: caller.prioritized_tags,
    }))
  );

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">
            <Msg id="pages.organizeCallAssignment.callers.title" />
          </Typography>
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
