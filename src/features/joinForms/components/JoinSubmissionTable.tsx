import { DataGridPro } from '@mui/x-data-grid-pro';
import { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, useTheme } from '@mui/material';

import messageIds from '../l10n/messageIds';
import useJoinSubmissionMutations from '../hooks/useJoinSubmissionMutations';
import { ZetkinJoinSubmission } from '../types';
import { Msg, useMessages } from 'core/i18n';

const useStyles = makeStyles((theme) => ({
  chip: {
    backgroundColor: theme.palette.grey[300],
    borderRadius: '1em',
    color: theme.palette.text.secondary,
    fontSize: 'xs',
    padding: '0.2em 0.7em',
  },
}));

type Props = {
  onSelect: (submission: ZetkinJoinSubmission) => void;
  orgId: number;
  submissions: ZetkinJoinSubmission[];
};

const JoinSubmissionTable: FC<Props> = ({ onSelect, orgId, submissions }) => {
  const classes = useStyles();
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const { approveSubmission } = useJoinSubmissionMutations(orgId);

  return (
    <Box bgcolor={theme.palette.background.paper} m={2}>
      <DataGridPro
        columns={[
          {
            field: 'state',
            flex: 1,
            headerName: messages.submissionList.status(),
            renderCell: (params) => {
              return (
                <Box className={classes.chip}>
                  {messages.submissionPane.states[params.row.state]()}
                </Box>
              );
              // />
            },
            valueGetter: (params) => params.row.state,
          },
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
                // TODO: Handle rejectButton click
                return (
                  <Box display="flex" gap={2}>
                    <Button variant="text">
                      <Msg id={messageIds.submissionList.rejectButton} />
                    </Button>
                    <Button
                      onClick={() => {
                        approveSubmission(params.row.id);
                      }}
                      variant="outlined"
                    >
                      <Msg id={messageIds.submissionList.approveButton} />
                    </Button>
                  </Box>
                );
              } else {
                return null;
              }
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
    </Box>
  );
};

export default JoinSubmissionTable;
