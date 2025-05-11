import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { Box, Chip } from '@mui/material';
import { FC, useState } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid-pro';

import { ZetkinViewColumn } from '../../types';
import { ZetkinSurveyOption } from 'utils/types/zetkin';
import { usePanes } from 'utils/panes';
import { IColumnType } from '.';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import ViewSurveySubmissionPreview from '../../ViewSurveySubmissionPreview';
import useToggleDebounce from 'utils/hooks/useToggleDebounce';
import oldTheme from 'theme';

export type SurveyOptionsViewCell =
  | {
      selected: ZetkinSurveyOption[];
      submission_id: number;
      submitted: string;
    }[]
  | null;

export default class SurveyOptionsColumnType
  implements IColumnType<ZetkinViewColumn, SurveyOptionsViewCell>
{
  cellToString(cell: SurveyOptionsViewCell): string {
    return cell?.length ? cell[0].selected.map((o) => o.text).toString() : '';
  }

  getColDef(): Omit<GridColDef, 'field'> {
    return {
      filterable: true,
      renderCell: (params: GridRenderCellParams) => {
        return <Cell cell={params.row[params.field]} />;
      },
      sortComparator: (v1: string[][], v2: string[][]) => {
        const getPriority = (cell: string[][]) => {
          if (cell == null || cell.length == 0) {
            return 0;
          } else {
            return -cell[cell.length - 1].length;
          }
        };

        return getPriority(v1) - getPriority(v2);
      },
      valueGetter: (params: GridValueGetterParams) => {
        const cell: SurveyOptionsViewCell = params.row[params.field];
        return cell?.map((response) =>
          response.selected.map((selected) => selected.text)
        );
      },
    };
  }
  getSearchableStrings(cell: SurveyOptionsViewCell): string[] {
    return cell?.length ? cell[0].selected.map((o) => o.text) : [];
  }
}

const useStyles = makeStyles(() => ({
  cell: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  cellCount: {
    alignItems: 'center',
    backgroundColor: oldTheme.palette.outline.main,
    borderRadius: '50%',
    display: 'flex',
    fontSize: '0.8em',
    height: '1.75em',
    justifyContent: 'center',
    width: '1.75em',
  },
  content: {
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': '2',
    display: '-webkit-box !important',
    flex: '1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    wordBreak: 'break-all',
  },
  optionsChip: {
    border: '1px solid ' + oldTheme.palette.grey.A400,
    borderRadius: '2em',
    display: 'inline',
    fontSize: '0.8em',
    lineHeight: '1.8',
    marginRight: '0.25em',
    padding: '1px 4px',
  },
}));

const Cell: FC<{
  cell: SurveyOptionsViewCell | undefined;
}> = ({ cell }) => {
  const { orgId } = useRouter().query;
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openPane } = usePanes();
  const { open: openPopper, close: closePopper } = useToggleDebounce(
    (ev) => setAnchorEl(ev.currentTarget),
    () => setAnchorEl(null)
  );

  if (!cell?.length) {
    return null;
  }

  const sorted = cell.concat().sort((sub0, sub1) => {
    const d0 = new Date(sub0.submitted);
    const d1 = new Date(sub1.submitted);
    return d1.getTime() - d0.getTime();
  });

  return (
    <Box
      className={styles.cell}
      onMouseOut={closePopper}
      onMouseOver={openPopper}
    >
      <Box className={styles.content}>
        {sorted[0].selected.map((s) => (
          <Box key={s.id} className={styles.optionsChip} component="span">
            {s.text}
          </Box>
        ))}
      </Box>
      <Box className={styles.cellCount} component="span">
        {sorted[0].selected.length}
      </Box>
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
            index == cell.length - 1
              ? sub.selected.map((s) => (
                  <Chip
                    key={s.id}
                    label={s.text}
                    sx={{ marginRight: '0.25em' }}
                    variant="outlined"
                  />
                ))
              : null,
          submitted: sub.submitted,
        }))}
      />
    </Box>
  );
};
