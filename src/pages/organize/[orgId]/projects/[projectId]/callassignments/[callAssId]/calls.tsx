import { FC, useState } from 'react';
import { Check, HeadsetMicOutlined, PriorityHigh } from '@mui/icons-material';
import Head from 'next/head';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Popper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import {
  DataGridPro,
  GridColDef,
  GridFilterInputValueProps,
} from '@mui/x-data-grid-pro';

import { scaffold } from 'utils/next';
import { PageWithLayout } from 'utils/types';
import { useNumericRouteParams } from 'core/hooks';
import useServerSide from 'core/useServerSide';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';
import CallAssignmentLayout from 'features/callAssignments/layout/CallAssignmentLayout';
import useCalls from 'features/callAssignments/hooks/useCalls';
import { Call } from 'features/callAssignments/apiTypes';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/callAssignments/l10n/messageIds';
import callMessageIds from 'features/call/l10n/messageIds';
import {
  CallState,
  CallStateString,
  callStateToString,
  ZetkinCall,
} from 'features/call/types';
import {
  colorByCallState,
  iconByCallState,
} from 'features/call/components/PreviousCallsInfo';
import { MUIIcon } from 'zui/components/types';
import ZUIDateTime from 'zui/ZUIDateTime';
import useToggleDebounce from 'utils/hooks/useToggleDebounce';
import oldTheme from 'theme';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import useCall from 'features/callAssignments/hooks/useCall';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (ctx) => {
    const { orgId, projectId, callAssId } = ctx.params!;

    return {
      props: {
        assignmentId: callAssId,
        orgId,
        projectId,
      },
    };
  },
  {
    authLevelRequired: 2,
  }
);

type Props = {
  call: Call;
  orgId: number;
};

const OrganizerActionNeededCell: FC<Props> = ({ call, orgId }) => {
  const updateCall = useCall();
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { open: openPopper, close: closePopper } = useToggleDebounce(
    (ev) => setAnchorEl(ev.currentTarget),
    () => setAnchorEl(null)
  );

  if (!call.organizer_action_needed) {
    return null;
  }

  return (
    <Box
      onMouseOut={closePopper}
      onMouseOver={openPopper}
      sx={{
        alignItems: 'center',
        backgroundColor: call.organizer_action_taken
          ? 'transparent'
          : oldTheme.palette.statusColors.orange,
        cursor: 'pointer',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {call.organizer_action_taken ? <Check /> : <PriorityHigh />}
      <Popper
        anchorEl={anchorEl}
        open={!!anchorEl}
        popperOptions={{ placement: 'left' }}
        sx={{ width: 300 }}
      >
        <Paper elevation={2}>
          <Stack sx={{ alignItems: 'flex-start', gap: 1, padding: 2 }}>
            <Typography variant="h5">
              <Msg id={messageIds.calls.organizerActionNeeded.title} />
            </Typography>
            <Box>
              <Typography color="secondary">
                <ZUIRelativeTime datetime={call.update_time} />
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {call.message_to_organizer}
              </Typography>
            </Box>
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await updateCall(orgId, call.id, {
                  organizer_action_taken: !call.organizer_action_taken,
                });
                setLoading(false);
              }}
              startIcon={
                call.organizer_action_taken ? <PriorityHigh /> : <Check />
              }
              variant={call.organizer_action_taken ? 'text' : 'contained'}
            >
              <Msg
                id={
                  messageIds.calls.organizerActionNeeded[
                    call.organizer_action_taken ? 'unsolve' : 'solve'
                  ]
                }
              />
            </Button>
          </Stack>
        </Paper>
      </Popper>
    </Box>
  );
};

const CallerNoteCell: FC<{ call: Call; orgId: number }> = ({ call, orgId }) => {
  const [loading, setLoading] = useState(false);
  const updateCall = useCall();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { open: openPopper, close: closePopper } = useToggleDebounce(
    (ev) => setAnchorEl(ev.currentTarget),
    () => setAnchorEl(null)
  );

  const note = call.notes;

  return (
    <Box
      onMouseOut={closePopper}
      onMouseOver={openPopper}
      sx={{
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        cursor: 'pointer',
        display: '-webkit-box',
        maxHeight: '100%',
        overflow: 'hidden',
        whiteSpace: 'normal',
        width: '100%',
      }}
    >
      {note}
      <Popper
        anchorEl={anchorEl}
        open={!!anchorEl}
        popperOptions={{ placement: 'left' }}
        sx={{ width: 300 }}
      >
        <Paper elevation={2}>
          <Stack sx={{ alignItems: 'flex-start', gap: 1, padding: 2 }}>
            <Typography variant="h5">
              <Msg id={messageIds.calls.callerNote.title} />
            </Typography>
            <Box>
              <Typography color="secondary">
                <ZUIRelativeTime datetime={call.update_time} />
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{note}</Typography>
            </Box>
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await updateCall(orgId, call.id, {
                  notes: null,
                });
                setLoading(false);
              }}
            >
              <Msg id={messageIds.calls.callerNote.delete} />
            </Button>
          </Stack>
        </Paper>
      </Popper>
    </Box>
  );
};

type StateString = CallStateString | 'unfinished';
const states: Record<ZetkinCall['state'], StateString> = {
  ...callStateToString,
  [CallState.UNFINISHED]: 'unfinished',
};
const colors: Record<
  ZetkinCall['state'],
  'success' | 'warning' | 'error' | 'info'
> = { ...colorByCallState, [CallState.UNFINISHED]: 'info' };
const icons: Record<ZetkinCall['state'], MUIIcon> = {
  ...iconByCallState,
  [CallState.UNFINISHED]: HeadsetMicOutlined,
};

const StateFilterInput: FC<
  GridFilterInputValueProps & {
    options: CallState[];
  }
> = ({ applyValue, item, options }) => {
  const [value, setValue] = useState('');

  const callStates: { name: StateString; value: CallState }[] = options.map(
    (option) => {
      return {
        name: states[+option as CallState],
        value: option,
      };
    }
  );

  return (
    <FormControl>
      <InputLabel variant="standard">
        <Msg id={messageIds.calls.filters.status} />
      </InputLabel>
      <Select
        onChange={(evt) => {
          setValue(evt.target.value);
          applyValue({ ...item, value: evt.target.value });
        }}
        value={value}
        variant="standard"
      >
        {callStates.map((state) => {
          const Icon = icons[state.value];

          return (
            <MenuItem
              key={state.name}
              value={state.value === 0 ? '0' : state.value}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Box
                  sx={(theme) => {
                    const color = colors[state.value];

                    return {
                      alignItems: 'center',
                      color:
                        color === 'warning'
                          ? theme.palette.warning.dark
                          : theme.palette[color].main,
                      display: 'flex',
                      gap: 1,
                      justifyContent: 'center',
                    };
                  }}
                >
                  <Icon />
                </Box>
                <Typography>
                  {state.name === 'unfinished' && (
                    <Msg id={messageIds.calls.callState.unfinished} />
                  )}
                  {state.name !== 'unfinished' && (
                    <Msg
                      id={callMessageIds.about.previousCalls.status[state.name]}
                    />
                  )}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const ActionNeededFilterInput: FC<
  GridFilterInputValueProps & {
    options: ['actionNeeded', 'actionTaken', 'none'];
  }
> = ({ applyValue, item, options }) => {
  const [value, setValue] = useState('');

  return (
    <FormControl>
      <InputLabel variant="standard">
        <Msg id={messageIds.calls.filters.flagged.title} />
      </InputLabel>
      <Select
        onChange={(evt) => {
          setValue(evt.target.value);
          applyValue({ ...item, value: evt.target.value });
        }}
        value={value}
        variant="standard"
      >
        {options.map((option) => {
          return (
            <MenuItem key={option} value={option}>
              <Typography>
                <Msg id={messageIds.calls.filters.flagged[option]} />
              </Typography>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const CallsPage: PageWithLayout = () => {
  const { orgId, callAssId } = useNumericRouteParams();
  const onServer = useServerSide();
  const messages = useMessages(messageIds);
  const callMessages = useMessages(callMessageIds);
  const { data: callAssignment } = useCallAssignment(orgId, callAssId);
  const { data: calls, isLoading } = useCalls(orgId, callAssId);

  if (onServer || !callAssignment) {
    return null;
  }

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
          InputComponent: StateFilterInput,
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
          label: 'Is',
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
          InputComponent: ActionNeededFilterInput,
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
          label: 'Is',
          value: 'is',
        },
      ],
      headerName: messages.calls.columns.flagged(),
      renderCell: (params) => {
        const value = params.row;

        if (!value) {
          return null;
        }

        return <OrganizerActionNeededCell call={value} orgId={orgId} />;
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
    <>
      <Head>
        <title>{callAssignment?.title}</title>
      </Head>
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
    </>
  );
};

CallsPage.getLayout = function getLayout(page) {
  return <CallAssignmentLayout removePadding>{page}</CallAssignmentLayout>;
};

export default CallsPage;
