import { DataGridPro } from '@mui/x-data-grid-pro';
import { FC } from 'react';
import { Box, Button, useTheme } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { ZetkinJoinSubmission } from '../types';
import { Msg, useMessages } from 'core/i18n';

type Props = {
  onSelect: (submission: ZetkinJoinSubmission) => void;
  submissions: ZetkinJoinSubmission[];
};

const JoinSubmissionTable: FC<Props> = ({ onSelect, submissions }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  return (
    <Box bgcolor={theme.palette.background.paper} m={2}>
      <DataGridPro
        columns={[
          {
            field: 'first_name',
            flex: 1,
            headerName: messages.submissionList.firstName(),
            valueGetter: (params) => params.row.person_data.first_name,
          },
          {
            field: 'last_name',
            flex: 1,
            headerName: messages.submissionList.lastName(),
            valueGetter: (params) => params.row.person_data.last_name,
          },
          {
            field: 'form',
            flex: 1,
            headerName: messages.submissionList.form(),
            valueGetter: (params) => params.row.form.title,
          },
          {
            field: 'submitted',
            flex: 1,
            headerName: messages.submissionList.timestamp(),
            type: 'dateTime',
            valueGetter: (params) => new Date(params.row.submitted),
          },
          {
            align: 'right',
            field: 'actions',
            flex: 1,
            headerName: '',
            renderCell: (params) => {
              if (params.row.state !== 'accepted') {
                // TODO: Handle clicks
                return (
                  <Box display="flex" gap={2}>
                    <Button variant="text">
                      <Msg id={messageIds.submissionList.rejectButton} />
                    </Button>
                    <Button variant="outlined">
                      <Msg id={messageIds.submissionList.approveButton} />
                    </Button>
                  </Box>
                );
              }
              return null;
            },
            valueGetter: (params) => params.row.state,
          },
        ]}
        hideFooter
        isRowSelectable={() => false}
        onRowClick={(params) => {
          onSelect(params.row);
        }}
        rows={submissions}
      />
    </Box>
  );
};

export default JoinSubmissionTable;
