import { GridColDef } from '@mui/x-data-grid-pro';
import { IColumnType } from '.';
import { makeStyles } from '@mui/styles';
import { ZetkinSurveyOption } from 'utils/types/zetkin';
import { ZetkinViewColumn } from '../../types';
import { Box, Chip } from '@mui/material';
import { FC, useState } from 'react';

import { usePanes } from 'utils/panes';
import { useRouter } from 'next/router';

import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import ViewSurveySubmissionPreview from '../../ViewSurveySubmissionPreview';

export type SurveyOptionsViewCell = {
  selected: ZetkinSurveyOption[];
  submission_id: number;
  submitted: string;
}[];

export default class SurveyOptionsColumnType
  implements IColumnType<ZetkinViewColumn, SurveyOptionsViewCell>
{
  cellToString(cell: SurveyOptionsViewCell): string {
    return cell.length ? cell[0].selected.map((o) => o.text).toString() : '';
  }

  getColDef(): Omit<GridColDef, 'field'> {
    return {
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return <Cell cell={params.value} />;
      },
    };
  }
}

const useStyles = makeStyles(() => ({
  cell: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    position: 'relative',
  },
  cellCount: {
    boxShadow: '0 0 0.8em rgba(0, 0, 0, 0.4)',
    float: 'right',
    minWidth: '1.2em',
    position: 'relative',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-20%, -50%)',
    transition: 'opacity 0.3s',
  },
  content: {
    '-webkit-box-orient': 'vertical',
    '-webkit-box-orient2': 'vertical',
    '-webkit-line-clamp': 2,
    display: '-webkit-box',
    maxHeight: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    width: '100%',
  },
  optionsChip: {
    fontSize: '0.8em',
    lineHeight: '1.8em',
    padding: '3px 5px',
  },
}));

const Cell: FC<{
  cell: SurveyOptionsViewCell;
}> = ({ cell }) => {
  const { orgId } = useRouter().query;
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openPane } = usePanes();

  if (cell.length == 0) {
    return null;
  }

  const sorted = cell?.sort((sub0, sub1) => {
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
        {sorted[0].selected.map((s) => (
          <Chip
            /*className={styles.optionsChip}*/
            key={s.id}
            label={s.text}
            size="small"
            variant="outlined"
          />
        ))}
        {
          <Chip
            className={styles.cellCount}
            label={sorted[0].selected.length}
          />
        }
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
          submissions={cell.map((sub, index) => ({
            id: sub.submission_id,
            matchingContent:
              index == 0
                ? sub.selected.map((s) => (
                    <Chip key={s.id} label={s.text} variant="outlined" />
                  ))
                : null,
            submitted: sub.submitted,
          }))}
        />
      </Box>
    </Box>
  );
};
