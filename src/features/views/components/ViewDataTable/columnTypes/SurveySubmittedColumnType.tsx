import { Box } from '@mui/material';
import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import { SurveySubmittedViewColumn } from '../../types';
import ZUIRelativeTime from '../../../../../zui/ZUIRelativeTime';

type SurveySubmittedViewCell = {
  submitted: string;
}[];

export default class SurveySubmittedColumnType
  implements IColumnType<SurveySubmittedViewColumn, SurveySubmittedViewCell>
{
  cellToString(cell: SurveySubmittedViewCell): string {
    return cell.length ? new Date(cell[0].submitted).toLocaleDateString() : '';
  }
  getColDef(): Omit<GridColDef<SurveySubmittedViewCell>, 'field'> {
    return {
      renderCell: (params) => {
        return <Cell cell={params.value} />;
      },
      width: 250,
    };
  }
}

const Cell: FC<{ cell: SurveySubmittedViewCell }> = ({ cell }) => {
  if (cell.length === 0) {
    return null;
  }

  const sorted = cell.sort((sub0, sub1) => {
    const d0 = new Date(sub0.submitted);
    const d1 = new Date(sub1.submitted);
    return d1.getTime() - d0.getTime();
  });

  return (
    <Box sx={{ cursor: 'default' }}>
      <ZUIRelativeTime datetime={sorted[0].submitted} />
    </Box>
  );
};
