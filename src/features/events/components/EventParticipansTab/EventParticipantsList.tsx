import { FC } from 'react';
import { GridColDef } from '@mui/x-data-grid-pro';
import { Box, Button, Typography } from '@mui/material';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import noPropagate from 'utils/noPropagate';
import theme from 'theme';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIEventParticipantsList from 'zui/ZUIEventParticipantLists';
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
        <ZUIEventParticipantsList
          chipColor={theme.palette.grey[500]}
          chipNumber={model.getSignedParticipants().toString()}
          columns={columns}
          description={messages.eventParticipantsList.descriptionSignups()}
          rows={model.getPendingSignUps() ?? []}
          title={messages.eventParticipantsList.signUps()}
        />
      )}
      <ZUIEventParticipantsList
        chipColor={model.getParticipantStatus()}
        chipNumber={
          model.getAvailParticipants() + '/' + data.num_participants_required
        }
        columns={columns}
        description={messages.eventParticipantsList.descriptionBooked()}
        rows={model.getParticipants().data ?? []}
        title={messages.eventParticipantsList.bookedParticipants()}
      />
    </Box>
  );
};

export default EventParticipantsList;
