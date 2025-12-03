import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid-pro';
import { History } from '@mui/icons-material';

import { getEllipsedString } from 'utils/stringUtils';
import { IColumnType } from '.';
import { SurveyResponseViewColumn } from '../../types';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import { usePanes } from 'utils/panes';
import ViewSurveySubmissionPreview from '../../ViewSurveySubmissionPreview';
import useToggleDebounce from 'utils/hooks/useToggleDebounce';

export type SurveyResponseViewCell = {
  submission_id: number;
  submitted: string;
  text: string | null;
}[];

export default class SurveyResponseColumnType
  implements IColumnType<SurveyResponseViewColumn, SurveyResponseViewCell>
{
  cellToString(cell: SurveyResponseViewCell): string {
    return cell?.length && cell[0].text ? cell[0].text : '';
  }

  getColDef(): Omit<GridColDef<SurveyResponseViewCell>, 'field'> {
    return {
      filterable: true,
      renderCell: (params: GridRenderCellParams) => {
        return <Cell cell={params.row[params.field]} />;
      },
      sortComparator: (v1: string, v2: string) => -v1.localeCompare(v2),
      valueGetter: (params: GridValueGetterParams) => {
        const cell: SurveyResponseViewCell = params.row[params.field];
        if (!cell?.length) {
          return '';
        }

        const sortedSubmissions = cell.concat().sort((sub0, sub1) => {
          const d0 = new Date(sub0.submitted);
          const d1 = new Date(sub1.submitted);
          return d1.getTime() - d0.getTime();
        });
        const mostRecentSubmission = sortedSubmissions[0];

        return mostRecentSubmission.text || '';
      },
      width: 250,
    };
  }

  getSearchableStrings(cell: SurveyResponseViewCell): string[] {
    return cell
      .map((response) => response?.text)
      .filter((e) => typeof e == 'string');
  }
}

const Cell: FC<{ cell: SurveyResponseViewCell | undefined }> = ({ cell }) => {
  const { orgId } = useRouter().query;
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
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        onMouseOut={closePopper}
        onMouseOver={openPopper}
        sx={{
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          display: '-webkit-box',
          maxHeight: '100%',
          overflow: 'hidden',
          whiteSpace: 'normal',
          width: '100%',
        }}
      >
        <Box alignItems="center" display="flex" justifyContent="space-between">
          {sorted[0].text}
          {cell.length > 1 && <History color="secondary" />}
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
              index == 0 && sub.text ? getEllipsedString(sub.text, 300) : null,
            submitted: sub.submitted,
          }))}
        />
      </Box>
    </Box>
  );
};
