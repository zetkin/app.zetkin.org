import { Box } from '@mui/system';
import { FC } from 'react';
import useCurrentUserEvents from 'features/user/hooks/useCurrentUserEvents';
import { scaffold } from 'utils/next';
import ZUIFuture from 'zui/ZUIFuture';
import { GridColDef } from '@mui/x-data-grid-pro';
import { DataGrid } from '@mui/x-data-grid';

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

const columns: GridColDef[] = [
  {
    disableColumnMenu: true,
    field: 'title',
    flex: 1,
    headerName: 'Title',
    valueGetter: (params) => {
      const row = params.row;
      let title = row?.title ?? '';
      if (title === '') {
        title = row?.activity?.title;
      }
      if (title === '') {
        title = row?.campaign?.title;
      }
      if (title === '') {
        console.log(row);
        title = 'Untitled event';
      }
      return title;
    },
  },
];

const Page: FC<PageProps> = () => {
  const events = useCurrentUserEvents();
  return (
    <Box
      sx={{
        pl: '1em',
        pr: '1em',
      }}
    >
      <h1>All Events</h1>
      <p>Sign up for more events here.</p>
      <ZUIFuture future={events}>
        {(data) => (
          <DataGrid
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10]}
            pagination
            rows={data}
          />
        )}
      </ZUIFuture>
      <p>
        TODO: Add events here, and a button for filtering between event type and
        project, (and organization?)
      </p>
    </Box>
  );
};

export default Page;
