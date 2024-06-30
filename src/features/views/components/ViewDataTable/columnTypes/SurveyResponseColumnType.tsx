import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid-pro';

import { getEllipsedString } from 'utils/stringUtils';
import { IColumnType } from '.';
import { SurveyResponseViewColumn } from '../../types';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import { usePanes } from 'utils/panes';
import ViewSurveySubmissionPreview from '../../ViewSurveySubmissionPreview';

export type SurveyResponseViewCell = {
  submission_id: number;
  submitted: string;
  text: string;
}[];

export default class SurveyResponseColumnType
  implements IColumnType<SurveyResponseViewColumn, SurveyResponseViewCell>
{
  cellToString(cell: SurveyResponseViewCell): string {
    return cell?.length ? cell[0].text : '';
  }

  getColDef(): Omit<GridColDef<SurveyResponseViewCell>, 'field'> {
    return {
      filterable: true,
      renderCell: (params: GridRenderCellParams) => {
        return <Cell cell={params.row[params.field]} />;
      },
      valueGetter: (params: GridValueGetterParams) => {
        const cell: SurveyResponseViewCell = params.row[params.field];
        return this.cellToString(cell);
      },
      width: 250,
    };
  }

  getSearchableStrings(cell: SurveyResponseViewCell): string[] {
    return cell.map((sub) => sub.text);
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

const Cell: FC<{ cell: SurveyResponseViewCell | undefined }> = ({ cell }) => {
  const { orgId } = useRouter().query;
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openPane } = usePanes();

  if (!cell?.length) {
    return null;
  }

  const sorted = cell.concat().sort((sub0, sub1) => {
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
          onOpenSubmission={(id) => {
            openPane({
              render() {
                return (
                  <SurveySubmissionPane
                    id={id}
                    orgId={parseInt(orgId as string)}
                  />
                );
              },
              width: 400,
            });
          }}
          submissions={cell
            .filter((sub) => sub.text)
            .map((sub, index) => ({
              id: sub.submission_id,
              matchingContent:
                index == 0 ? getEllipsedString(sub.text, 300) : null,
              submitted: sub.submitted,
            }))}
        />
      </Box>
    </Box>
  );
};
