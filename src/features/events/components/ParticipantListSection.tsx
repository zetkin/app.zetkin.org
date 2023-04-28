import { FC } from 'react';
import ZUINumberChip from '../../../zui/ZUINumberChip';

import { Box, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

interface ParticipantListSectionListProps {
  chipColor: string;
  chipNumber: string;
  columns: GridColDef[];
  description: string;
  rows: ZetkinEventResponse[] | ZetkinEventParticipant[];
  title: string;
}

const ParticipantListSection: FC<ParticipantListSectionListProps> = ({
  chipColor,
  chipNumber,
  columns,
  description,
  rows,
  title,
}) => {
  return (
    <>
      <Box
        sx={{
          '& div': { backgroundColor: 'transparent' },
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
        <ZUINumberChip color={chipColor} outlined={true} value={chipNumber} />
      </Box>
      <Typography mb={2} variant="body1">
        {description}
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection
        columns={columns}
        rows={rows ?? []}
      />
    </>
  );
};

export default ParticipantListSection;
