import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import noPropagate from 'utils/noPropagate';
import theme from 'theme';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUINumberChip from 'zui/ZUINumberChip';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';

interface EventParticipantsListProps {
  data: ZetkinEvent;
  model: EventDataModel;
  orgId: number;
}

const EventParticipantsList: FC<EventParticipantsListProps> = ({
  data,
  model,
  orgId,
}) => {
  const messages = useMessages(messageIds);

  const columns: GridColDef[] = [
    {
      align: 'center',
      disableColumnMenu: true,
      field: 'avatar',
      headerName: '',
      hideSortIcons: true,
      renderCell: (params) => (
        <ZUIAvatar orgId={orgId} personId={params.row.id} />
      ),
      resizable: false,
      sortable: false,
      width: 20,
    },
    {
      disableColumnMenu: true,
      field: 'name',
      flex: 1,
      headerName: messages.eventParticipantsList.columnName(),
      hideSortIcons: true,
      renderCell: (params) => {
        if (params.row.person) {
          return <Typography>{params.row.person.name}</Typography>;
        } else {
          return (
            <Typography>
              {params.row.first_name + ' ' + params.row.last_name}
            </Typography>
          );
        }
      },
      resizable: false,
      sortable: false,
    },
    {
      disableColumnMenu: true,
      field: 'phone',
      flex: 1,
      headerName: messages.eventParticipantsList.columnPhone(),
      hideSortIcons: true,
      renderCell: (params) => {
        if (params.row.person) {
          return <Typography>{''}</Typography>;
        } else {
          return <Typography>{params.row.phone}</Typography>;
        }
      },
      resizable: false,
      sortable: false,
    },
    {
      disableColumnMenu: true,
      field: 'email',
      flex: 1,
      headerName: messages.eventParticipantsList.columnEmail(),
      hideSortIcons: true,
      resizable: false,
      sortable: false,
      valueGetter: (params) => {
        if (params.row.person) {
          return '';
        } else {
          return `${params.row.email}`;
        }
      },
    },
    {
      disableColumnMenu: true,
      field: 'notified',
      flex: 1,
      headerName: messages.eventParticipantsList.columnNotified(),
      hideSortIcons: true,
      renderCell: (params) => {
        if (params.row.person) {
          return <ZUIRelativeTime datetime={params.row.response_date} />;
        } else {
          return <ZUIRelativeTime datetime={params.row.reminder_sent} />;
        }
      },
      resizable: false,
      sortable: false,
    },
    {
      align: 'right',
      disableColumnMenu: true,
      field: 'cancel',
      flex: 1,
      headerName: '',
      hideSortIcons: true,
      renderCell: (params) => {
        if (params.row.person) {
          return (
            <>
              <Button sx={{ marginRight: '10px' }} variant="text">
                {messages.eventParticipantsList.buttonCancel()}
              </Button>
              <Button
                onClick={noPropagate(() => {
                  model.addParticipant(params.row.id);
                })}
                variant="outlined"
              >
                {messages.eventParticipantsList.buttonBook()}
              </Button>
            </>
          );
        } else {
          return (
            <Button variant="text">
              {messages.eventParticipantsList.buttonCancel()}
            </Button>
          );
        }
      },
      resizable: false,
      sortable: false,
    },
  ];

  return (
    <Box>
      {model.getSignedParticipants() > 0 && (
        <>
          <Box
            sx={{
              '& div': { backgroundColor: 'transparent' },
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '15px',
              marginTop: '15px',
            }}
          >
            <Typography mr={2} variant="h4">
              {messages.eventParticipantsList.signUps()}
            </Typography>
            <ZUINumberChip
              color={theme.palette.grey[500]}
              outlined={true}
              value={model.getSignedParticipants()}
            />
          </Box>
          <Typography mb={2} variant="body1">
            {messages.eventParticipantsList.descriptionSignups()}
          </Typography>
          <DataGridPro
            autoHeight
            checkboxSelection
            columns={columns}
            rows={model.getPendingSignUps() ?? []}
          />
        </>
      )}

      <Box
        sx={{
          '& div': { backgroundColor: 'transparent' },
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          marginTop: '15px',
        }}
      >
        <Typography mb={2} mr={2} variant="h4">
          {messages.eventParticipantsList.bookedParticipants()}
        </Typography>
        <ZUINumberChip
          color={model.getParticipantStatus()}
          outlined={true}
          value={
            model.getAvailParticipants() + '/' + data.num_participants_required
          }
        />
      </Box>
      <Typography mb={2} variant="body1">
        {messages.eventParticipantsList.descriptionBooked()}
      </Typography>
      <DataGridPro
        autoHeight
        checkboxSelection
        columns={columns}
        rows={model.getParticipants().data ?? []}
      />
    </Box>
  );
};

export default EventParticipantsList;
