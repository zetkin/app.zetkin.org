import { DataGridPro } from '@mui/x-data-grid-pro';
import { FC, useState } from 'react';
import { Box, Button, Tooltip, useTheme } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import useJoinSubmissionMutations from '../hooks/useJoinSubmissionMutations';
import usePotentialDuplicates from '../hooks/usePotentialDuplicates';
import { PotentialDuplicate } from '../rpc/getPotentialDuplicates';
import PotentialDuplicateDialog from './PotentialDuplicateDialog';
import { ZetkinJoinSubmission } from '../types';
import { Msg, useMessages } from 'core/i18n';
import oldTheme from 'theme';

type Props = {
  onSelect: (submission: ZetkinJoinSubmission) => void;
  orgId: number;
  submissions: ZetkinJoinSubmission[];
};

const JoinSubmissionTable: FC<Props> = ({ onSelect, orgId, submissions }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();
  const { approveSubmission, deleteSubmission } =
    useJoinSubmissionMutations(orgId);
  const { data: potentialDuplicates } = usePotentialDuplicates(orgId);
  const [pendingDuplicate, setPendingDuplicate] =
    useState<PotentialDuplicate | null>(null);

  return (
    <Box bgcolor={theme.palette.background.paper} m={2}>
      <DataGridPro
        columns={[
          {
            disableColumnMenu: true,
            field: 'state',
            flex: 2,
            headerName: messages.status(),
            renderCell: (params) => {
              return (
                <Box
                  sx={{
                    backgroundColor: oldTheme.palette.grey[300],
                    borderRadius: '1em',
                    color: oldTheme.palette.text.secondary,
                    fontSize: 'xs',
                    padding: '0.2em 0.7em',
                  }}
                >
                  {messages.states[params.row.state]()}
                </Box>
              );
            },
            valueGetter: (value, row) => row.state,
          },
          {
            disableColumnMenu: true,
            field: 'first_name',
            flex: 2,
            headerName: messages.submissionList.firstName(),
            valueGetter: (value, row) => row.person_data.first_name,
          },
          {
            disableColumnMenu: true,
            field: 'last_name',
            flex: 2,
            headerName: messages.submissionList.lastName(),
            valueGetter: (value, row) => row.person_data.last_name,
          },
          {
            disableColumnMenu: true,
            field: 'form',
            flex: 2,
            headerName: messages.submissionList.form(),
            valueGetter: (value, row) => row.form.title,
          },
          {
            disableColumnMenu: true,
            field: 'submitted',
            flex: 2,
            headerName: messages.submissionList.timestamp(),
            type: 'dateTime',
            valueGetter: (value, row) => new Date(row.submitted),
          },
          {
            align: 'right',
            disableColumnMenu: true,
            field: 'actions',
            flex: 3,
            headerName: '',
            renderCell: (params) => {
              if (params.row.state !== 'accepted') {
                const potentialDuplicate = potentialDuplicates?.find(
                  (dup) => dup.id == params.row.id
                );
                return (
                  <Box alignItems="center" display="flex" gap={2} height="100%">
                    {potentialDuplicate && (
                      <Tooltip
                        title={messages.submissionList.potentialDuplicate()}
                      >
                        <WarningAmber color="warning" fontSize="small" />
                      </Tooltip>
                    )}
                    <Button
                      onClick={(event) => {
                        deleteSubmission(params.row.id);
                        event.stopPropagation();
                      }}
                      variant="text"
                    >
                      <Msg id={messageIds.submissionList.rejectButton} />
                    </Button>
                    <Button
                      onClick={(event) => {
                        if (potentialDuplicate) {
                          setPendingDuplicate(potentialDuplicate);
                        } else {
                          approveSubmission(params.row.id);
                        }
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
      <PotentialDuplicateDialog
        onClose={() => setPendingDuplicate(null)}
        onSubmit={() => {
          if (pendingDuplicate) {
            approveSubmission(pendingDuplicate.id);
          }
          setPendingDuplicate(null);
        }}
        orgId={orgId}
        potentialDuplicate={pendingDuplicate}
      />
    </Box>
  );
};

export default JoinSubmissionTable;
