import * as React from 'react';
import Box from '@mui/material/Box';
import CallAssignments from './CallAssignments';
import { CheckBoxSharp } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import EventSignUpList from 'features/events/components/EventSignUpList';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import useCurrentUserEvents from 'features/user/hooks/useCurrentUserEvents';
import ZUIFuture from 'zui/ZUIFuture';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface TaskDisplayData {
  id: number;
  description: string;
  expectedTime: number;
  dueDate: string;
}

function createTaskDisplayData(
  id: number,
  description: string,
  expectedTime: number,
  dueDate: string
): TaskDisplayData {
  return {
    description,
    dueDate,
    expectedTime,
    id,
  };
}

const taskRows = [
  createTaskDisplayData(
    1,
    'Protest against crapitalism',
    60,
    new Date().toLocaleDateString(undefined, {
      month: 'numeric',
      day: 'numeric',
    })
  ),
  createTaskDisplayData(
    2,
    'Buy candy',
    30,
    new Date().toLocaleDateString(undefined, {
      month: 'numeric',
      day: 'numeric',
    })
  ),
  createTaskDisplayData(
    3,
    'Read a book',
    120,
    new Date().toLocaleDateString(undefined, {
      month: 'numeric',
      day: 'numeric',
    })
  ),
];

const taskColumns: GridColDef[] = [
  {
    disableColumnMenu: true,
    field: 'description',
    flex: 1,
    headerName: 'Description',
    minWidth: 130,
  },
  {
    disableColumnMenu: true,
    field: 'expectedTime',
    headerName: 'Estimate',
    type: 'number',
  },
  {
    disableColumnMenu: true,
    field: 'dueDate',
    headerName: 'Due',
    type: 'number',
  },
];

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type PageProps = void;

const Page: FC<PageProps> = () => {
  const events = useCurrentUserEvents();
  return (
    <Box
      sx={{
        pl: '1em',
        pr: '1em',
      }}
    >
      <h1>My Todo</h1>

      <Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '5px',
            margin: 2,
          }}
        >
          <EventIcon />
          <h2>Events</h2>
        </Box>

        <p>TODO: Add events here</p>
        <ZUIFuture future={events}>
          {(data) => <EventSignUpList events={data} />}
        </ZUIFuture>
      </Box>

      <Box>
        <CallAssignments />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: '5px',
            margin: 2,
          }}
        >
          <CheckBoxSharp />
          <h2>Tasks</h2>
        </Box>

        <DataGrid
          rows={taskRows}
          columns={taskColumns}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Page;
