import { DataGridPro } from '@mui/x-data-grid-pro';
import { FC } from 'react';
import { Box, Button, Card } from '@mui/material';

import messageIds from '../l10n/messageIds';
import { ZetkinJoinSubmission } from '../types';
import { Msg, useMessages } from 'core/i18n';

type Props = {
  onSelect: (submission: ZetkinJoinSubmission) => void;
  submissions: ZetkinJoinSubmission[];
};

const JoinSubmissionTable: FC<Props> = ({ onSelect, submissions }) => {
  const messages = useMessages(messageIds);

  return (
    <Box m={2}>
      <Card>
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
              renderCell: () => {
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
              },
            },
          ]}
          hideFooter
          isRowSelectable={() => false}
          onRowClick={(params) => {
            onSelect(params.row);
          }}
          rows={submissions}
        />
      </Card>
    </Box>
  );
};

export default JoinSubmissionTable;
