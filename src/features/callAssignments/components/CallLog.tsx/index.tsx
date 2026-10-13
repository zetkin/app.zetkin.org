import { FC } from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';

import { useMessages } from 'core/i18n';
import useCalls from 'features/callAssignments/hooks/useCalls';
import { Call } from 'features/callAssignments/apiTypes';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUIDateTime from 'zui/ZUIDateTime';
import messageIds from 'features/callAssignments/l10n/messageIds';
import callMessageIds from 'features/call/l10n/messageIds';
import { CallState, callStateToString, ZetkinCall } from 'features/call/types';
import OrganizerActionCell from './OrganizerActionCell';
import CallerNoteCell from './CallerNoteCell';
import CallStatusFilterInput from './CallStatusFilterInput';
import { colors, icons } from './utils';
import OrganizerActionFilterInput from './OrganizerActionFilterInput';

type Props = {
  callAssId: number;
  orgId: number;
};

const CallLog: FC<Props> = ({ callAssId, orgId }) => {
  const messages = useMessages(messageIds);
  const callMessages = useMessages(callMessageIds);
  const { data: calls, isLoading } = useCalls(orgId, callAssId);

  const columns: GridColDef<Call>[] = [
    {
      disableColumnMenu: true,
      field: 'id',
      headerName: ' ',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <ZUIPersonHoverCard personId={params.row.target.id}>
            <Avatar
              src={`/api/orgs/${orgId}/people/${params.row.target.id}/avatar`}
            />
          </ZUIPersonHoverCard>
        </Box>
      ),
      sortable: false,
    },
    {
      field: 'name',
      flex: 1,
      headerName: messages.calls.columns.name(),
      valueGetter: (value, row) => row.target.name,
      width: 250,
    },
    {
      field: 'allocation_time',
      flex: 1,
      headerName: messages.calls.columns.time(),
      renderCell: (params) => (
        <Typography>
          <ZUIDateTime datetime={params.row.allocation_time} />
        </Typography>
      ),
      type: 'dateTime',
      valueGetter: (value, cell) => new Date(cell.allocation_time),
      width: 250,
    },
    {
      field: 'status',
      filterOperators: [
        {
          InputComponent: CallStatusFilterInput,
          InputComponentProps: { options: Object.keys(icons) },
          getApplyFilterFn: (filterItem) => {
            if (
              !filterItem.field ||
              !filterItem.value ||
              !filterItem.operator
            ) {
              return null;
            }

            return (value) => {
              return value === +filterItem.value;
            };
          },
          label: messages.calls.filters.is(),
          value: 'is',
        },
      ],
      headerName: messages.calls.columns.status(),
      renderCell: (params) => {
        const call = params.row as ZetkinCall;
        const Icon = icons[call.state];

        return (
          <Box
            sx={(theme) => {
              const color = colors[call.state];

              return {
                alignItems: 'center',
                color:
                  color === 'warning'
                    ? theme.palette.warning.dark
                    : theme.palette[color].main,
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                width: '100%',
              };
            }}
          >
            <Tooltip
              placement="left"
              title={
                call.state === CallState.UNFINISHED
                  ? messages.calls.callState.unfinished()
                  : callMessages.about.previousCalls.status[
                      callStateToString[call.state]
                    ]()
              }
            >
              <Icon />
            </Tooltip>
          </Box>
        );
      },
      sortComparator: (a, b) => b - a,
      valueGetter: (value, cell) => cell.state,
    },
    {
      field: 'flagged',
      filterOperators: [
        {
          InputComponent: OrganizerActionFilterInput,
          InputComponentProps: {
            options: ['actionNeeded', 'actionTaken', 'none'],
          },
          getApplyFilterFn: (filterItem) => {
            if (
              !filterItem.field ||
              !filterItem.value ||
              !filterItem.operator
            ) {
              return null;
            }

            return (value) => {
              if (filterItem.value === 'actionNeeded') {
                return value.actionNeeded && !value.actionTaken;
              } else if (filterItem.value === 'actionTaken') {
                return value.actionNeeded && value.actionTaken;
              } else {
                return !value.actionNeeded;
              }
            };
          },
          label: messages.calls.filters.is(),
          value: 'is',
        },
      ],
      headerName: messages.calls.columns.flagged(),
      renderCell: (params) => {
        const value = params.row;

        if (!value) {
          return null;
        }

        return <OrganizerActionCell call={value} orgId={orgId} />;
      },
      sortComparator: (a, b) => {
        if (a.actionNeeded && b.actionNeeded) {
          if (!a.actionTaken && !b.actionTaken) {
            return 0;
          } else if (!a.actionTaken && b.actionTaken) {
            return -1;
          } else {
            return 1;
          }
        } else if (a.actionNeeded && !b.actionNeeded) {
          return -1;
        } else if (!a.actionNeeded && b.actionNeeded) {
          return 1;
        } else {
          //Neither has actionNeeded
          return 0;
        }
      },
      valueGetter: (value, cell) => {
        return {
          actionNeeded: cell.organizer_action_needed,
          actionTaken: cell.organizer_action_taken,
        };
      },
    },
    {
      field: 'caller_note',
      flex: 1,
      headerName: messages.calls.columns.callerNote(),
      renderCell: (params) => {
        if (!params.row.notes) {
          return null;
        }

        return <CallerNoteCell call={params.row} orgId={orgId} />;
      },
      width: 250,
    },
    {
      field: 'caller',
      headerName: messages.calls.columns.caller(),
      renderCell: (params) => {
        return (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <ZUIPersonHoverCard personId={params.row.caller.id}>
              <Avatar
                src={`/api/orgs/${orgId}/people/${params.row.caller.id}/avatar`}
              />
            </ZUIPersonHoverCard>
          </Box>
        );
      },
      valueGetter: (value, cell) => cell.caller.name,
    },
    {
      field: 'caller_name',
      headerName: messages.calls.columns.callerName(),
      valueGetter: (value, cell) => cell.caller.name,
      width: 250,
    },
  ];

  return (
    <DataGridPro
      columns={columns}
      disableColumnPinning
      disableColumnReorder
      disableColumnSelector
      disableRowSelectionOnClick
      hideFooter
      loading={isLoading}
      rows={calls?.toSorted((a, b) => {
        return (
          new Date(b.allocation_time).getTime() -
          new Date(a.allocation_time).getTime()
        );
      })}
      slotProps={{
        loadingOverlay: {
          noRowsVariant: 'linear-progress',
          variant: 'linear-progress',
        },
      }}
    />
  );
};

export default CallLog;
