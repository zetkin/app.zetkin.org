import { GridColDef } from '@mui/x-data-grid-pro';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { Check, History } from '@mui/icons-material';
import { FC, useState } from 'react';

import { IColumnType } from '.';
import { Msg } from 'core/i18n';
import { SurveyOptionViewColumn } from '../../types';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import theme from '../../../../../theme';
import { usePanes } from 'utils/panes';
import ViewSurveySubmissionPreview from '../../ViewSurveySubmissionPreview';

import messageIds from 'features/views/l10n/messageIds';

type SurveyOptionViewCell =
  | {
      selected: boolean;
      submission_id: number;
      submitted: string;
    }[]
  | null;

export default class SurveyOptionColumnType
  implements IColumnType<SurveyOptionViewColumn, SurveyOptionViewCell>
{
  cellToString(cell: SurveyOptionViewCell): string {
    const pickedThisOption = cell?.filter((submission) => submission.selected);
    return pickedThisOption?.length
      ? messageIds.shareDialog.download.local_bool._defaultMessage
      : '';
  }

  getColDef(): Omit<GridColDef<SurveyOptionViewColumn>, 'field'> {
    return {
      headerAlign: 'center',
      renderCell: (params) => {
        return <Cell cell={params.value} />;
      },
      type: 'boolean',
    };
  }

  getSearchableStrings(): string[] {
    return [];
  }
}

const Cell: FC<{ cell: SurveyOptionViewCell }> = ({ cell }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { openPane } = usePanes();
  const { orgId } = useRouter().query;

  if (!cell?.length) {
    return null;
  }

  const hasPickedThisOption = !!cell.filter((submission) => submission.selected)
    .length;

  if (!hasPickedThisOption) {
    return null;
  }

  const sorted = cell.concat().sort((sub0, sub1) => {
    const d0 = new Date(sub0.submitted);
    const d1 = new Date(sub1.submitted);
    return d1.getTime() - d0.getTime();
  });

  const mostRecent = sorted[0];

  return (
    <Box
      alignItems="center"
      bgcolor={mostRecent.selected ? theme.palette.success.light : ''}
      display="flex"
      height="100%"
      justifyContent="center"
      onMouseOut={() => setAnchorEl(null)}
      onMouseOver={(ev) => setAnchorEl(ev.currentTarget)}
      width="100%"
    >
      {mostRecent.selected ? (
        <Check sx={{ opacity: '0.5' }} />
      ) : (
        <History color="secondary" />
      )}
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
        submissions={sorted.map((sub, index) => {
          let matchingContent: JSX.Element | null = null;

          if (sub.selected) {
            matchingContent = (
              <Box alignItems="center" display="flex">
                <Check sx={{ paddingRight: 1 }} />
                <Msg id={messageIds.surveyOptionCell.selected} />
              </Box>
            );
          } else if (index === 0 && !sub.selected) {
            matchingContent = (
              <Typography color="secondary" sx={{ fontStyle: 'italic' }}>
                <Msg id={messageIds.surveyOptionCell.notSelected} />
              </Typography>
            );
          }

          return {
            id: sub.submission_id,
            matchingContent: matchingContent,
            submitted: sub.submitted.toString(),
          };
        })}
      />
    </Box>
  );
};
