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
            disableColumnMenu: true,
            field: 'state',
            flex: 1,
            headerName: messages.status(),
            renderCell: (params) => {
              return (
                <Box className={classes.chip}>
                  {messages.states[params.row.state]()}
                </Box>
              );
              // />
            },
            valueGetter: (params) => params.row.state,
          },
          {
            disableColumnMenu: true,
            field: 'first_name',
            flex: 1,
            headerName: messages.submissionList.firstName(),
            valueGetter: (params) => params.row.person_data.first_name,
          },
          {
            disableColumnMenu: true,
            field: 'last_name',
            flex: 1,
            headerName: messages.submissionList.lastName(),
            valueGetter: (params) => params.row.person_data.last_name,
          },
          {
            disableColumnMenu: true,
            field: 'form',
            flex: 1,
            headerName: messages.submissionList.form(),
            valueGetter: (params) => params.row.form.title,
          },
          {
            disableColumnMenu: true,
            field: 'submitted',
            flex: 1,
            headerName: messages.submissionList.timestamp(),
            type: 'dateTime',
            valueGetter: (params) => new Date(params.row.submitted),
          },
          {
            align: 'right',
            disableColumnMenu: true,
            field: 'actions',
            flex: 1,
            headerName: '',
            renderCell: (params) => {
              if (params.row.state !== 'accepted') {
                return (
                  <Box display="flex" gap={2}>
                    {/* TODO: Handle rejectButton click */}
                    {/* <Button variant="text">
                      <Msg id={messageIds.submissionList.rejectButton} />
                    </Button> */}
                    <Button
                      onClick={(event) => {
                        approveSubmission(params.row.id);
                        event.stopPropagation();
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
            sortable: false,
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
