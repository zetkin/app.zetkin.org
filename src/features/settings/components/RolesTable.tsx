import { Box } from '@mui/system';
import { FC } from 'react';
import { Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import { ZetkinOfficial } from 'utils/types/zetkin';

type RolesTableProps = {
  columns: GridColDef[];
  description: string;
  rows: ZetkinOfficial[];
  title: string;
};

const RolesTable: FC<RolesTableProps> = ({
  columns,
  description,
  rows,
  title,
}) => {
  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '15px',
          marginTop: '15px',
        }}
      >
        <Typography mr={2} variant="h4">
          {title}
        </Typography>
      </Box>
      <Typography mb={2} variant="body1">
        {description}
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection={false}
        columns={columns}
        rows={rows}
      />
    </>
  );
};

export default RolesTable;
