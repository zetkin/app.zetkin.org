import { Box } from '@mui/system';
import { FC } from 'react';
import { scaffold } from 'utils/next';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

const columns: GridColDef[] = [
  {
    disableColumnMenu: true,
    field: 'title',
    flex: 1,
    headerName: 'Title',
  },
];

export const getServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type PageProps = { callAssignments: ZetkinCallAssignment[] };

const Page: FC<PageProps> = ({ callAssignments }) => {
  return (
    <Box>
      <DataGrid
        columns={columns}
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[10]}
        pagination
        rows={callAssignments}
      />
    </Box>
  );
};

export default Page;
