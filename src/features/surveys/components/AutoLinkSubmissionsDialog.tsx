import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { DataGridPro, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Box, Button, Tooltip, Typography } from '@mui/material';

import ZUIDialog from 'zui/ZUIDialog';
import useSurveyAutoLinkableSubmissions from 'features/surveys/hooks/useSurveyAutoLinkableSubmissions';
import ZUIFuture from 'zui/ZUIFuture';
import { AutoLinkCandidate } from 'features/surveys/rpc/getAutoLinkableSubmissions';
import {
  ZetkinPerson,
  ZetkinSurveySubmissionRespondent,
} from 'utils/types/zetkin';
import { useSurveySubmissionBulkSetResponder } from 'features/surveys/hooks/useSurveySubmission';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';

export const AutoLinkSubmissionsDialog: FC<{
  onClose: () => void;
  open: boolean;
  orgId: number;
  surveyId: number;
}> = ({ orgId, surveyId, onClose, open }) => {
  const autoLinkableSubmissions = useSurveyAutoLinkableSubmissions(
    orgId,
    surveyId
  );

  const gridColumns = useMemo(() => {
    const makeSimpleColumn = (
      field: keyof (ZetkinSurveySubmissionRespondent | ZetkinPerson),
      headerName: string,
      key: keyof Omit<AutoLinkCandidate, 'id'>
    ) => ({
      field: `${key}.${field}`,
      flex: 1,
      headerName: headerName,
      renderCell: (params: GridRenderCellParams<AutoLinkCandidate, string>) => {
        return (
          <Tooltip title={params.row[key][field]}>
            <Typography>{params.row[key][field]}</Typography>
          </Tooltip>
        );
      },
      sortable: true,
    });
    return [
      makeSimpleColumn(
        'first_name',
        messages.autoLink.columns.submissionFirstName(),
        'respondent'
      ),
      makeSimpleColumn(
        'last_name',
        messages.autoLink.columns.submissionLastName(),
        'respondent'
      ),
      makeSimpleColumn(
        'email',
        messages.autoLink.columns.submissionEmail(),
        'respondent'
      ),
      makeSimpleColumn(
        'email',
        messages.autoLink.columns.matchedEmail(),
        'suggestion'
      ),
      makeSimpleColumn(
        'last_name',
        messages.autoLink.columns.matchedLastName(),
        'suggestion'
      ),
      makeSimpleColumn(
        'first_name',
        messages.autoLink.columns.matchedFirstName(),
        'suggestion'
      ),
    ];
  }, []);

  const [selection, setSelection] = useState<number[]>([]);
  const bulkSetRespondentId = useSurveySubmissionBulkSetResponder(orgId);

  const startAutoLink = useCallback(async () => {
    if (
      !autoLinkableSubmissions.data ||
      autoLinkableSubmissions.data.autoLinkable.length === 0 ||
      !selection ||
      selection.length === 0
    ) {
      throw new Error('No data');
    }

    const selectionMap = selection.reduce((prev, cur) => {
      prev[cur] = true;
      return prev;
    }, {} as Record<number, boolean>);

    const toLink = autoLinkableSubmissions.data.autoLinkable.filter(
      (candidate) => selectionMap[candidate.id]
    );

    const batchSize = 20;
    const toLinkBatches = Array.from(
      { length: Math.ceil(toLink.length / batchSize) },
      (_, i) => toLink.slice(i * batchSize, i * batchSize + batchSize)
    );

    for (const batch of toLinkBatches) {
      await bulkSetRespondentId(
        batch.map((candidate) => ({
          respondentId: candidate.suggestion.id,
          submissionId: candidate.id,
        }))
      );
    }

    return toLink.length;
  }, [selection, autoLinkableSubmissions.data, bulkSetRespondentId]);

  const { showSnackbar } = useContext(ZUISnackbarContext);
  const messages = useMessages(messageIds);

  return (
    <ZUIDialog
      maxWidth={'xl'}
      onClose={onClose}
      open={open}
      title={messages.autoLink.title()}
    >
      <ZUIFuture future={autoLinkableSubmissions}>
        {(data) => (
          <DataGridPro
            autoHeight
            checkboxSelection={true}
            columns={gridColumns}
            disableColumnFilter
            disableColumnMenu
            onRowSelectionModelChange={(model) =>
              setSelection(model as number[])
            }
            pageSizeOptions={[100, 250, 500]}
            pagination
            rows={data.autoLinkable}
            style={{
              border: 'none',
            }}
          />
        )}
      </ZUIFuture>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '5px',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={onClose} variant={'outlined'}>
          {messages.autoLink.close()}
        </Button>
        <Tooltip
          placement={'top'}
          title={
            selection.length === 0
              ? messages.autoLink.tooltips.notEnoughRowsSelected()
              : messages.autoLink.tooltips.startAutoLinking()
          }
        >
          <span>
            <Button
              disabled={selection.length === 0}
              onClick={() => {
                startAutoLink()
                  .then((count) => {
                    onClose();
                    showSnackbar(
                      'success',
                      messages.autoLink.success({ count })
                    );
                  })
                  .catch((err) => {
                    let msg: string;
                    if (err instanceof Error) {
                      msg = err.message;
                    } else if (typeof err === 'string') {
                      msg = err;
                    } else {
                      msg = JSON.stringify(err);
                    }
                    showSnackbar(
                      'error',
                      messages.autoLink.error({ err: msg })
                    );
                  });
              }}
              variant={'contained'}
            >
              {messages.autoLink.linkSelected()}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </ZUIDialog>
  );
};
