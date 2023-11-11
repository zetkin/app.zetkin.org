import { FC, useEffect, useState } from 'react';
import { scaffold } from 'utils/next';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Box } from '@mui/system';

const scaffoldOptions = {
  allowNonOfficials: true,
  authLevelRequired: 1,
};

export const getServerSideProps = scaffold(async () => {
  return {
    props: {},
  };
}, scaffoldOptions);

type PageProps = { callAssignments: ZetkinCallAssignment[] };

const pageSize = 10;
const Page: FC<PageProps> = ({ callAssignments }) => {
  const [page, setPage] = useState(0);
  const [callAssignmentListView, setCallAssignmentListView] = useState<
    ZetkinCallAssignment[]
  >([]);
  const length = callAssignments.length;
  useEffect(() => {
    setCallAssignmentListView(
      callAssignments.slice(page * pageSize, (page + 1) * pageSize)
    );
  }, [callAssignments, page]);

  function changePage(incr: number) {
    setPage((prev) => prev + incr);
  }

  return (
    <Box>
      <Table aria-label="a dense table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {callAssignmentListView.map(
            (callAssignment: ZetkinCallAssignment) => (
              <TableRow
                key={callAssignment.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {callAssignment.title}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      {length >= pageSize && (
        <Box sx={{ alignItems: 'baseline', display: 'flex', margin: 2 }}>
          <Button onClick={() => changePage(-1)}>Prev</Button>
          <p>
            Page {page + 1} of {(length % pageSize) - 1}
          </p>
          <Button onClick={() => changePage(1)}>Next</Button>
        </Box>
      )}
    </Box>
  );
};

export default Page;
