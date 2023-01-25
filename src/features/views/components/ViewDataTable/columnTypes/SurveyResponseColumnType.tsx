import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import { makeStyles } from '@mui/styles';
import { FC, useState } from 'react';

import { getEllipsedString } from 'utils/stringUtils';
import { IColumnType } from '.';
import { SurveyResponseViewColumn } from '../../types';
import ViewSurveySubmissionPreview from '../../ViewSurveySubmissionPreview';

type SurveyResponceViewCell = {
  submission_id: number;
  submitted: string;
  text: string;
}[];

export default class SurveyResponseColumnType
  implements IColumnType<SurveyResponseViewColumn, SurveyResponceViewCell>
{
  cellToString(cell: SurveyResponceViewCell): string {
    return cell.length ? cell[0].text : '';
  }

  getColDef(): Omit<GridColDef<SurveyResponceViewCell>, 'field'> {
    return {
      renderCell: (params) => {
        return <Cell cell={params.value} />;
      },
      width: 250,
    };
  }
}

const useStyles = makeStyles({
  cell: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
  },
  content: {
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 2,
    display: '-webkit-box',
    maxHeight: '100%',
    overflow: 'hidden',
    whiteSpace: 'normal',
    width: '100%',
  },
});

const Cell: FC<{ cell: SurveyResponceViewCell }> = ({ cell }) => {
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (cell.length == 0) {
    return null;
  }

  const sorted = cell.sort((sub0, sub1) => {
    const d0 = new Date(sub0.submitted);
    const d1 = new Date(sub1.submitted);
    return d1.getTime() - d0.getTime();
  });

  return (
    <Box className={styles.cell}>
      <Box
        className={styles.content}
        onMouseOut={() => setAnchorEl(null)}
        onMouseOver={(ev) => setAnchorEl(ev.currentTarget)}
      >
        {sorted[0].text}
        <ViewSurveySubmissionPreview
          anchorEl={anchorEl}
          submissions={cell.map((sub) => ({
            id: sub.submission_id,
            matchingContent: getEllipsedString(sub.text, 300),
            submitted: sub.submitted,
          }))}
        />
      </Box>
    </Box>
  );
};
