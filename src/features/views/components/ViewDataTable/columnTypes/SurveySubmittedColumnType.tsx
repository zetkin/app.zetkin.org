import { AssignmentTurnedInOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid-pro';

import { IColumnType } from '.';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import { SurveySubmittedViewColumn } from '../../types';
import { usePanes } from 'utils/panes';
import { useRouter } from 'next/router';
import ZUIRelativeTime from '../../../../../zui/ZUIRelativeTime';

type SurveySubmittedViewCell =
  | {
      submission_id: number;
      submitted: string;
    }[]
  | null;

export default class SurveySubmittedColumnType
  implements IColumnType<SurveySubmittedViewColumn, SurveySubmittedViewCell>
{
  cellToString(cell: SurveySubmittedViewCell): string {
    return cell?.length ? new Date(cell[0].submitted).toLocaleDateString() : '';
  }
  getColDef(): Omit<GridColDef<NonNullable<SurveySubmittedViewCell>>, 'field'> {
    return {
      renderCell: (params: GridRenderCellParams) => {
        return <Cell cell={params.row[params.field]} />;
      },
      type: 'date',
      valueGetter: (params: GridValueGetterParams) => {
        const submissions: SurveySubmittedViewCell = params.row[params.field];
        if (submissions?.length) {
          const lastSub = submissions[submissions.length - 1];
          return new Date(lastSub.submitted);
        }
        return null;
      },
      width: 250,
    };
  }
  getSearchableStrings(): string[] {
    return [];
  }
}

const Cell: FC<{ cell: SurveySubmittedViewCell | undefined }> = ({ cell }) => {
  const { orgId } = useRouter().query;
  const { openPane } = usePanes();

  if (!cell?.length) {
    return null;
  }

  const sorted = cell.sort((sub0, sub1) => {
    const d0 = new Date(sub0.submitted);
    const d1 = new Date(sub1.submitted);
    return d1.getTime() - d0.getTime();
  });

  return (
    <Box
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      sx={{ cursor: 'default' }}
      width="100%"
    >
      <Box sx={{ overflowX: 'hidden' }}>
        <ZUIRelativeTime datetime={sorted[0].submitted} />
      </Box>
      <AssignmentTurnedInOutlined
        color="secondary"
        onClick={() =>
          openPane({
            render() {
              return (
                <SurveySubmissionPane
                  id={sorted[0].submission_id}
                  orgId={parseInt(orgId as string)}
                />
              );
            },
            width: 400,
          })
        }
        sx={{ cursor: 'pointer' }}
      />
    </Box>
  );
};
